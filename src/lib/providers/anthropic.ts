import { ChatAnthropic } from '@langchain/anthropic';
import logger from '../../utils/logger';

const ANTHROPIC_MAPPING_RAW = process.env.ANTHROPIC_MAPPING || 'Claude 3.5 Sonnet=claude-3-5-sonnet-20240620,Claude 3 Opus=claude-3-opus-20240229,Claude 3 Sonnet=claude-3-sonnet-20240229,Claude 3 Haiku=claude-3-haiku-20240307'
export const ANTHROPIC_MAPPING = ANTHROPIC_MAPPING_RAW.split(',').reduce((acc, curr) => {
  const [key, value] = curr.split('=');
  acc[key] = value;
  return acc;
}, {} as Record<string, string>);

export const loadAnthropicChatModels = async () => {
  try {
    return Object.entries<string>(ANTHROPIC_MAPPING).reduce((acc, [key, value]) => {
      acc[key] = new ChatAnthropic({
        temperature: 0.7,
        model: value,
        anthropicApiUrl: process.env.ANTHROPIC_BASE_URL,
      });
      return acc;
    }, {} as Record<string, ChatAnthropic>)
  } catch (err) {
    logger.error(`Error loading Anthropic models: ${err}`);
    return [];
  }
};
