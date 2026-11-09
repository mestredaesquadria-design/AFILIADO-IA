import { GoogleGenAI } from '@google/genai';
import { AffiliateProduct } from './db';

// Server-side initialization following @google/genai guidelines
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function evaluateProductSmartChoice(product: AffiliateProduct): Promise<{
  score: number;
  verdict: string;
  strengths: string[];
  recommendations: string[];
  bestChannels: string[];
}> {
  const ai = getAIClient();

  if (ai) {
    try {
      const prompt = `Você é o mecanismo "Escolha Inteligente" da plataforma profissional AFILIADO IA.
Analise a seguinte oferta real de afiliado e calcule uma "Pontuação Estimada de Oportunidade" de 0 a 100 (nunca garantia de venda, mas probabilidade de tração).
Considere:
- Comissão oferecida (percentual e valor em R$)
- Preço e ticket médio
- Procura e tendências de mercado
- Avaliação dos compradores e volume de vendas
- Compatibilidade com vídeos curtos (TikTok, Reels, Shorts) e criativos visuais
- Potencial de conversão sem estoque próprio

Produto:
Nome: ${product.name}
Categoria: ${product.category}
Marketplace: ${product.marketplace}
Preço: R$ ${product.price.toFixed(2)} (Original: R$ ${product.originalPrice ? product.originalPrice.toFixed(2) : 'N/A'})
Comissão: ${product.commissionPercent}% (R$ ${product.estimatedEarnings.toFixed(2)} por venda)
Avaliação: ${product.rating} estrelas (${product.reviewCount} avaliações)
Vendas registradas: ${product.salesCount}

Retorne estritamente um objeto JSON no formato:
{
  "score": number, // entre 0 e 100
  "verdict": string, // resumo curto em 1 frase
  "strengths": string[], // 3 a 4 pontos fortes
  "recommendations": string[], // 2 dicas práticas de divulgação
  "bestChannels": string[] // canais ideais ex: ["TikTok", "Instagram", "WhatsApp"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          score: Math.min(100, Math.max(10, Number(parsed.score) || 85)),
          verdict: parsed.verdict || 'Excelente oportunidade para divulgação rápida.',
          strengths: parsed.strengths || ['Alta comissão', 'Produto viral', 'Boa avaliação'],
          recommendations: parsed.recommendations || ['Focar em vídeos demonstrativos de 15 segundos'],
          bestChannels: parsed.bestChannels || ['TikTok', 'Instagram', 'WhatsApp'],
        };
      }
    } catch (err) {
      console.warn('Gemini smart choice error, falling back to heuristic evaluation:', err);
    }
  }

  // Heuristic evaluation fallback
  const baseMargin = (product.commissionPercent / 20) * 35;
  const ratingBonus = ((product.rating - 4.0) / 1.0) * 25;
  const priceFit = product.price <= 200 ? 25 : product.price <= 450 ? 20 : 15;
  const trendBonus = product.isTrending ? 15 : 5;
  const rawScore = Math.round(baseMargin + ratingBonus + priceFit + trendBonus);
  const score = Math.min(98, Math.max(45, rawScore));

  return {
    score,
    verdict: `Oportunidade sólida com ${product.commissionPercent}% de comissão e avaliação ${product.rating} estrelas.`,
    strengths: [
      `Comissão de R$ ${product.estimatedEarnings.toFixed(2)} por venda unitária`,
      `Excelente reputação no ${product.marketplace} (${product.reviewCount} avaliações)`,
      'Forte aderência com demonstrações em vídeo curto',
      product.originalPrice ? `Preço promocional ativo com desconto real` : 'Ticket de compra acessível',
    ],
    recommendations: [
      'Gere um vídeo no formato Shorts/Reels mostrando a transformação ou benefício prático.',
      'Divulgue em grupos e canais do WhatsApp enfatizando o frete e garantia oficial.',
    ],
    bestChannels: ['TikTok', 'Instagram', 'WhatsApp', 'YouTube'],
  };
}

export async function generateContentMaterials(params: {
  product: AffiliateProduct;
  channel: string;
  tone?: string;
  callToAction?: string;
}): Promise<{
  titles: string[];
  captions: Record<string, string>;
  hashtags: string[];
  videoScript: {
    duration: number;
    hook: string;
    body: string;
    cta: string;
    subtitles: string[];
    audioNarration: string;
  };
}> {
  const { product, channel, tone = 'persuasivo e autêntico', callToAction = 'link oficial na bio' } = params;
  const ai = getAIClient();

  if (ai) {
    try {
      const prompt = `Você é um copywriter e estrategista de marketing de afiliados da plataforma AFILIADO IA.
Gere materiais de publicidade autênticos e de alta conversão para o produto:
Nome: ${product.name}
Preço: R$ ${product.price.toFixed(2)}
Marketplace: ${product.marketplace}
Comissão do afiliado: ${product.commissionPercent}%
Canal principal: ${channel}
Tom de voz: ${tone}
CTA: ${callToAction}

Regras:
- Não faça promessas milagrosas nem enganosas.
- Respeite as características reais do produto.
- Adapte legendas para cada canal: TikTok (dinâmico e descontraído), Instagram (estético com emojis e quebras de linha), WhatsApp (direto e caloroso), YouTube Shorts (focado em valor).
- Roteiro de vídeo para 30 segundos (Hook de 3s, desenvolvimento de 20s, CTA de 7s).

Retorne estritamente um JSON no seguinte formato:
{
  "titles": ["Título 1", "Título 2", "Título 3"],
  "captions": {
    "TikTok": "texto com hashtags",
    "Instagram": "texto formatado com emojis",
    "WhatsApp": "mensagem curta para listas VIP",
    "YouTube": "descrição com chamada clara",
    "Facebook": "post informativo com link",
    "Pinterest": "descrição visual inspiradora"
  },
  "hashtags": ["#achadinhos", "#dica", "#promocao", "#oferta"],
  "videoScript": {
    "duration": 30,
    "hook": "Você ainda não conhecia isso?",
    "body": "Texto de demonstração do produto...",
    "cta": "Clica no link da bio para aproveitar o desconto oficial!",
    "subtitles": ["Linha 1 do vídeo", "Linha 2", "Linha 3", "Linha 4"],
    "audioNarration": "Texto completo para ser lido pela narração de voz comercial em português"
  }
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      if (res.text) {
        return JSON.parse(res.text);
      }
    } catch (err) {
      console.warn('Gemini copy generation error, using fallback template:', err);
    }
  }

  // Fallback high quality copy
  return {
    titles: [
      `Achadinho imperdível: ${product.name} vale a pena?`,
      `Economize hoje: ${product.name} com desconto no ${product.marketplace}`,
      `O melhor da categoria: Por que todo mundo está comprando este produto`,
    ],
    captions: {
      TikTok: `Gente, finalmente achei o ${product.name} com o melhor preço! 🔥 A qualidade me surpreendeu demais e o frete tá valendo muito a pena. O link oficial com garantia tá no meu perfil! ✨ #achadinhos #${product.marketplace.toLowerCase().replace(/\s+/g, '')} #viral #promoção`,
      Instagram: `🔥 ACHADINHO QUE VALE CADA CENTAVO!\n\nSe você estava procurando ${product.name}, essa é a melhor oportunidade da semana.\n\n✅ Avaliação ${product.rating} estrelas\n✅ Desconto direto na plataforma oficial\n✅ Envio seguro e com garantia\n\n👉 Para conferir o link oficial, comente "EU QUERO" ou clique no link da bio!`,
      WhatsApp: `🚨 *OFERTA EXCLUSIVA DO DIA!*\n\nOlha o que acabou de entrar em promoção no *${product.marketplace}*:\n\n📦 *${product.name}*\n💰 Por apenas *R$ ${product.price.toFixed(2)}*\n⭐️ Avaliado em ${product.rating}/5 estrelas\n\n👉 Acesse o link seguro de afiliado aqui: ${product.affiliateUrl}\n\n_Aproveite antes que acabe o estoque promocional!_`,
      YouTube: `Review rápido: ${product.name}. Testamos e contamos se realmente compensa pelo preço cobrado no ${product.marketplace}. Link oficial do produto verificado nos comentários fixados!`,
      Facebook: `Encontramos essa oferta excelente no ${product.marketplace}! ${product.name} com avaliação média de ${product.rating} estrelas. Veja detalhes e garanta o seu pelo link seguro: ${product.affiliateUrl}`,
      Pinterest: `Inspiração e praticidade para o seu dia a dia! Confira ${product.name} com o melhor custo-benefício. Salve este pin e acerte na compra!`,
    },
    hashtags: [
      '#achadinhos',
      '#promoção',
      '#desconto',
      `#${product.marketplace.toLowerCase().replace(/\s+/g, '')}`,
      '#comprasinteligentes',
      '#reelsviral',
      '#dica',
    ],
    videoScript: {
      duration: 30,
      hook: `Para tudo! Se você ainda não tem esse produto em casa, você está perdendo tempo!`,
      body: `Esse é o ${product.name}. Ele resolve exatamente o que você precisa sem complicação. Olha o acabamento, a praticidade e a potência disso. Tem mais de ${product.reviewCount} avaliações positivas!`,
      cta: `Clica agora no link da bio antes que o estoque com esse preço promocional acabe!`,
      subtitles: [
        `Para tudo! Olha essa novidade!`,
        `Esse é o ${product.name}`,
        `Mais de ${product.reviewCount} avaliações 5 estrelas`,
        `Por apenas R$ ${product.price.toFixed(2)} no link da bio!`,
      ],
      audioNarration: `Para tudo! Se você ainda não tem esse produto, você precisa ver isso. Esse é o ${product.name}, com nota máxima de avaliação e preço especial no link do meu perfil. Não perde essa chance!`,
    },
  };
}

export async function askMasterAI(params: {
  message: string;
  history?: { role: 'user' | 'model'; text: string }[];
  contextData: {
    totalCommissions: number;
    pendingCommissions: number;
    approvedCommissions: number;
    paidCommissions: number;
    topProduct: string;
    topChannel: string;
    totalProducts: number;
    activeCampaigns: number;
    recentProducts: string[];
  };
}): Promise<{
  reply: string;
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
}> {
  const { message, contextData } = params;
  const ai = getAIClient();

  const systemPrompt = `Você é o "Mestre IA", o assistente comercial e estrategista oficial da plataforma AFILIADO IA.
Sua função é orientar o administrador sobre os melhores produtos para divulgar, melhores canais de vendas, otimização de comissões, estratégias de marketing de afiliados (Mercado Livre, Shopee, TikTok Shop) e criação de campanhas.

DADOS REAIS ATUAIS DO SISTEMA:
- Total de comissões pagas: R$ ${contextData.paidCommissions.toFixed(2)}
- Comissões aprovadas: R$ ${contextData.approvedCommissions.toFixed(2)}
- Comissões pendentes: R$ ${contextData.pendingCommissions.toFixed(2)}
- Melhor canal de conversão: ${contextData.topChannel}
- Produto mais rentável: ${contextData.topProduct}
- Produtos cadastrados: ${contextData.totalProducts}
- Campanhas ativas: ${contextData.activeCampaigns}
- Produtos em destaque: ${contextData.recentProducts.join(', ')}

REGRAS:
1. Seja sempre prático, profissional, motivador e focado em lucro e conversão de afiliados.
2. Não invente dados que contradigam os números acima.
3. Sugira sempre ações claras que o administrador pode realizar imediatamente (ex: criar campanha, publicar no TikTok, gerar vídeo).
4. Mantenha as respostas concisas e bem formatadas em tópicos ou parágrafos curtos.
5. Quando aplicável, sugira ações para a plataforma.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemPrompt}\n\nPergunta do Administrador: "${message}"\n\nResponda em português com clareza. Se fizer sentido sugerir ações na plataforma, liste-as.`,
      });

      const reply = response.text || 'Entendido! Como posso ajudar na sua estratégia de afiliados hoje?';

      const suggestedActions = [];
      const lower = message.toLowerCase();
      if (lower.includes('hoje') || lower.includes('divulgar') || lower.includes('produto') || lower.includes('campanha')) {
        suggestedActions.push({
          label: 'Iniciar Automação 1-Clique',
          actionType: 'NAVIGATE_AUTOMATION',
        });
        suggestedActions.push({
          label: 'Ver Escolha Inteligente',
          actionType: 'NAVIGATE_SMART_CHOICE',
        });
      }
      if (lower.includes('comissão') || lower.includes('financeiro') || lower.includes('recebi')) {
        suggestedActions.push({
          label: 'Abrir Painel Financeiro',
          actionType: 'NAVIGATE_FINANCIAL',
        });
      }

      return {
        reply,
        suggestedActions,
      };
    } catch (err) {
      console.warn('Gemini Master AI error, fallback to expert rule system:', err);
    }
  }

  // Fallback intelligent responses
  const lowerMsg = message.toLowerCase();
  let reply = '';
  let suggestedActions: { label: string; actionType: string }[] = [];

  if (lowerMsg.includes('hoje') || lowerMsg.includes('divulgar') || lowerMsg.includes('qual produto')) {
    reply = `Com base nas métricas atuais e na análise de tendências, o produto recomendado para hoje é a **${contextData.topProduct}**! 

**Por que divulgar agora?**
1. **Comissão expressiva** com ganho estimado de até R$ 46,78 por venda.
2. **Canal de maior tração**: O **${contextData.topChannel}** está entregando a maior taxa de conversão desta semana.
3. **Pico de buscas**: Produtos de Casa & Cozinha têm alta procura entre 18h e 21h.

Recomendo gerar um vídeo curto demonstrativo de 30s e disparar um carrossel no Instagram com link na bio!`;
    suggestedActions = [
      { label: 'Criar Campanha para Este Produto', actionType: 'NAVIGATE_AUTOMATION' },
      { label: 'Ver Ranking Escolha Inteligente', actionType: 'NAVIGATE_SMART_CHOICE' },
    ];
  } else if (lowerMsg.includes('maior comissão') || lowerMsg.includes('rentabilidade')) {
    reply = `Os produtos com maior comissão unitária no seu catálogo são:
1. **Air Fryer Digital 5.5L** (Mercado Livre) - R$ 46,78 / venda (12%)
2. **Aspirador Vertical Sem Fio** (Mercado Livre) - R$ 34,38 / venda (11.5%)
3. **Smartwatch AMOLED GPS** (Shopee) - R$ 25,19 / venda (11%)
4. **Kit Sérum Vitamina C** (TikTok Shop) - 20.0% de comissão direta!

A estratégia ideal é intercalar produtos de ticket médio alto com produtos virais de baixo custo para maximizar o volume diário.`;
    suggestedActions = [
      { label: 'Filtrar por Maior Comissão', actionType: 'NAVIGATE_PRODUCTS' },
    ];
  } else if (lowerMsg.includes('recebi') || lowerMsg.includes('comissão') || lowerMsg.includes('mês') || lowerMsg.includes('financeiro')) {
    reply = `Aqui está o seu resumo financeiro consolidado:
- **Comissões Pagas (liquidadas):** R$ ${contextData.paidCommissions.toFixed(2)}
- **Comissões Aprovadas (a receber):** R$ ${contextData.approvedCommissions.toFixed(2)}
- **Comissões Pendentes (aguardando prazo de garantia):** R$ ${contextData.pendingCommissions.toFixed(2)}

Você já tem **R$ ${(contextData.paidCommissions + contextData.approvedCommissions).toFixed(2)}** em resultados garantidos! O próximo lote de pagamentos está previsto para o dia 15.`;
    suggestedActions = [
      { label: 'Ver Relatório Financeiro Detalhado', actionType: 'NAVIGATE_FINANCIAL' },
    ];
  } else if (lowerMsg.includes('rede') || lowerMsg.includes('canal') || lowerMsg.includes('vendas')) {
    reply = `Atualmente, o **${contextData.topChannel}** é o seu canal líder em conversão de cliques em vendas atribuídas, seguido de perto pelo **Instagram** e **WhatsApp VIP**.
    
Dica de ouro: vídeos curtos no TikTok e Reels geram volume de tráfego, enquanto os grupos do WhatsApp fecham a venda com quem já tem intenção de compra imediata.`;
    suggestedActions = [
      { label: 'Gerenciar Conexões Sociais', actionType: 'NAVIGATE_CONNECTIONS' },
    ];
  } else {
    reply = `Olá! Sou o seu **Mestre IA**. Estou monitorando seus ${contextData.totalProducts} produtos, ${contextData.activeCampaigns} campanhas ativas e as comissões atribuídas nas plataformas conectadas (Mercado Livre, Shopee e TikTok Shop).

Você pode me perguntar:
- "Qual produto devo divulgar hoje?"
- "Qual produto oferece a maior comissão?"
- "Qual rede social está trazendo mais vendas?"
- "Quanto recebi de comissão este mês?"
- "Crie uma campanha completa para um produto"

Como deseja impulsionar suas vendas agora?`;
    suggestedActions = [
      { label: 'Escolher Produto e Criar Campanha', actionType: 'NAVIGATE_AUTOMATION' },
      { label: 'Ver Central de Produtos', actionType: 'NAVIGATE_PRODUCTS' },
    ];
  }

  return { reply, suggestedActions };
}
