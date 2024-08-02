import { ChatOpenAI, OpenAIEmbeddings, AzureOpenAIEmbeddings, AzureChatOpenAI  } from '@langchain/openai';
import { getOpenaiApiKey } from '../../config';
import logger from '../../utils/logger';

const HAS_AZURE_OPENAI = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_MAPPING_RAW = process.env.AZURE_OPENAI_MAPPING || 'GPT-3.5 turbo=gpt-3.5-turbo,GPT-4=gpt-4,GPT-4 turbo=gpt-4-turbo,GPT-4 omni=gpt-4o,GPT-4 omni mini=gpt-4o-mini'
const AZURE_OPENAI_MAPPING = AZURE_OPENAI_MAPPING_RAW.split(',').reduce((acc, curr) => {
  const [key, value] = curr.split('=');
  acc[key] = value;
  return acc;
}, {} as Record<string, string>);
const AZURE_OPENAI_EMBEDDING_MAPPING_RAW = process.env.AZURE_OPENAI_EMBEDDING_MAPPING || 'Text embedding 3 small=text-embedding-3-small,Text embedding 3 large=text-embedding-3-large';
const AZURE_OPENAI_EMBEDDING_MAPPING = AZURE_OPENAI_EMBEDDING_MAPPING_RAW.split(',').reduce((acc, curr) => {
  const [key, value] = curr.split('=');
  acc[key] = value;
  return acc;
}, {} as Record<string, string>);

const loadOpenAIModels = async () => {
  try {
    return Object.entries<string>(AZURE_OPENAI_MAPPING).reduce((acc, [key, value]) => {
      acc[key] = new ChatOpenAI({
        modelName: value,
        temperature: 0.7,
      });
      return acc;
    }, {} as Record<string, ChatOpenAI>);
  } catch (err) {
    logger.error(`Error loading OpenAI models: ${err}`);
    return {};
  }
};
const loadAzureOpenAIModels = async () => {
  try {
    return Object.entries<string>(AZURE_OPENAI_MAPPING).reduce((acc, [key, value]) => {
      acc[key] = new AzureChatOpenAI({
        azureOpenAIApiDeploymentName: value,
        temperature: 0.7,
      });
      return acc;
    }, {} as Record<string, AzureChatOpenAI>);
  } catch (err) {
    logger.error(`Error loading Azure OpenAI models: ${err}`);
    return {};
  }
}

export const loadOpenAIChatModels = async () => {
  try {
    return HAS_AZURE_OPENAI ? await loadAzureOpenAIModels() : await loadOpenAIModels();
  } catch (err) {
    logger.error(`Error loading OpenAI models: ${err}`);
    return {};
  }
};

const loadAzureOpenAIEmbeddingsModelList = async () => {
  try {
    return Object.entries<string>(AZURE_OPENAI_EMBEDDING_MAPPING).reduce((acc, [key, value]) => {
      acc[key] = new AzureOpenAIEmbeddings({
        azureOpenAIApiDeploymentName: value,
      });
      return acc;
    }, {} as Record<string, AzureOpenAIEmbeddings>);
  } catch (err) {
    logger.error(`Error loading Azure OpenAI embeddings model: ${err}`);
    return {};
  }
}
const loadOpenAIEmbeddingsModelList = async () => {
  try {
    return Object.entries<string>(AZURE_OPENAI_EMBEDDING_MAPPING).reduce((acc, [key, value]) => {
      acc[key] = new OpenAIEmbeddings({
        modelName: value,
      });
      return acc;
    }, {} as Record<string, OpenAIEmbeddings>);
  } catch (err) {
    logger.error(`Error loading OpenAI embeddings model: ${err}`);
    return {};
  }
}

export const loadOpenAIEmbeddingsModels = async () => {
  try {
    return HAS_AZURE_OPENAI ? await loadAzureOpenAIEmbeddingsModelList() : await loadOpenAIEmbeddingsModelList();
  } catch (err) {
    logger.error(`Error loading OpenAI embeddings model: ${err}`);
    return {};
  }
};
