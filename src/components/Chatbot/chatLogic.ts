import type { ChatContext } from '../../types';

interface BotReply {
  text: string;
  suggestions?: string[];
}

export function contextReply(context: ChatContext): BotReply {
  switch (context.type) {
    case 'section':
      return sectionReply(context.section);
    case 'node':
      return nodeReply(context);
    case 'entity':
      return {
        text: `📦 "${context.entity.name}" has ${context.entity.rows.toLocaleString()} rows across ${context.entity.attributes.length} attributes. This dataset could link nicely to churn-risk or lifetime-value pipelines.`,
        suggestions: ['Explain attributes', 'Suggest a pipeline'],
      };
    case 'use-case':
      return {
        text: `💡 "${context.useCase.name}" bundles ${context.useCase.derivedFeatures} derived feature(s) and ${context.useCase.scenarios} scenario(s). Want me to walk through the inputs it needs?`,
        suggestions: ['Walk through inputs', 'Compare with similar use case'],
      };
    case 'causal':
      return {
        text: `🔗 Following "${context.label}" — a positive coefficient means the upstream factor pushes the downstream metric up; negative pulls it down. Want the plain-language read?`,
        suggestions: ['Explain in plain language', 'Show mediated effects'],
      };
    case 'run':
      return {
        text: `Pipeline executed successfully 🎉 "${context.pipelineName}" finished with a mean of ${context.mean.toFixed(3)}. Want me to summarize the distribution or compare it to the last run?`,
        suggestions: ['Summarize distribution', 'Compare to last run'],
      };
    default:
      return { text: "Hi there 👋 I'm your TwinX assistant — ask me anything about this pipeline." };
  }
}

function sectionReply(section: string): BotReply {
  const copy: Record<string, BotReply> = {
    'digital-twins': {
      text: '🧬 This is the entity layer — every pipeline draws its inputs from here. Click a card to preview synthetic sample rows.',
      suggestions: ['What is a digital twin?', 'Show a churn-related entity'],
    },
    'use-cases': {
      text: '📋 Use cases bundle capabilities mapped to the twin layer. "Customer Retention" often pairs nicely with churn-risk KPIs.',
      suggestions: ['Suggest a use case', 'Explain derived features'],
    },
    pipelines: {
      text: '⚙️ This is where decision pipelines come alive. Select a node to see its formula, execution metrics and synthetic samples.',
      suggestions: ['Explain this pipeline', 'Optimize pipeline'],
    },
    studio: {
      text: '🎨 Studio lets you drag-and-drop new nodes. Try adding a competitor_pressure node — I can suggest where to wire it in.',
      suggestions: ['Suggest a node to add'],
    },
    'live-features': {
      text: '📡 Live Features stream synthetic real-time signals. Great for monitoring engagement as it updates.',
    },
    'model-drift': {
      text: '📉 Model Drift tracks how prediction quality decays over time. Nothing to review yet on this seeded dataset.',
    },
    monitoring: { text: '📡 Monitoring is coming soon — I will let you know the moment it lands.' },
  };
  return copy[section] ?? { text: "I'm here if you need a hand exploring this section." };
}

function nodeReply(context: Extract<ChatContext, { type: 'node' }>): BotReply {
  const { node, pipelineName } = context;
  const byKind: Record<string, string> = {
    input: `📥 "${node.label}" feeds raw values from ${node.baseEntity ?? 'the twin layer'} straight into the "${pipelineName}" pipeline.`,
    calculation: `🧮 "${node.label}" is a calculation node${node.formula ? ` — it computes: ${node.formula}` : ''}. Tweak the inputs and re-run to see the outcome shift.`,
    kpi: `📊 "${node.label}" aggregates the calculation output. Right now it reads a mean of ${node.metrics?.mean ?? '—'}.`,
    model: `🧠 "${node.label}" is a gradient boosting model predicting the target. Its CVaR 5% sits at ${node.metrics?.cvar ?? '—'}.`,
    rollup: `🎲 "${node.label}" runs a Monte Carlo roll-up across trials to produce the system-level outcome distribution.`,
  };
  return {
    text: byKind[node.kind] ?? `Selected "${node.label}".`,
    suggestions: ['Explain this node', 'Optimization tips'],
  };
}

export function freeTextReply(input: string): BotReply {
  const q = input.toLowerCase();
  if (q.includes('optimi')) {
    return { text: '⚡ To optimize this pipeline, try widening the direct-deposit incentive or trimming fee tiers for at-risk segments — both pull churn_risk down in the formula.' };
  }
  if (q.includes('explain') || q.includes('kpi')) {
    return { text: '📖 KPI nodes aggregate a calculation across the population — here, mean(churn_risk) tells you the average risk across all customers in scope.' };
  }
  if (q.includes('summar')) {
    return { text: '📈 Most customers sit in a stable, low-risk band, but roughly 5% show elevated churn risk worth a targeted retention offer.' };
  }
  if (q.includes('help') || q.includes('stuck')) {
    return { text: "No worries — start by selecting a node in the graph, or open a Use Case to see its full pipeline. I'm right here if you get stuck." };
  }
  return {
    text: "Good question! I don't have live data wired up yet, but based on this seeded dataset I'd start by comparing the calculation and KPI nodes side by side.",
  };
}

export function proactiveTip(section: string): string | null {
  if (section === 'pipelines') return 'Would you like me to auto-run this pipeline daily? ⏱️';
  return null;
}
