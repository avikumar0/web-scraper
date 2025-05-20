import { ExecutionEnvironment } from '@/types/executor';
import { ClickElementTask } from '../task/ClickElement';
import { ExtractDataWithAiTask } from '../task/ExtractDataWithAI';
import prisma from '@/lib/prisma';
import { symmetricDecrypt } from '@/lib/encryption';
import OpenAI from 'openai';

export async function ExtractDataWitAiExecutor(
    environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>,
): Promise<boolean> {
    try {
        const credentials = environment.getInput("Credential");
        if (!credentials) {
            environment.log.error("Input->credentials is not defined");
        }

        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("Input->prompt is not defined");
        }

        const content = environment.getInput("Content");
        if (!content) {
            environment.log.error("Input->content is not defined");
        }

        //Get Credentials from DB
        const credential = await prisma.credential.findUnique({
            where: { id: credentials },
        });

        if (!credential) {
            environment.log.error("Credential not found");
            return false;
        }

        const plainCredentialValue = symmetricDecrypt(credential.value);
        if (!plainCredentialValue) {
            environment.log.error("Credential value is not valid. Cannot decrypt");
            return false;
        }

        const mockExtractedData = {
            usernameSelector: "#username",
            passwordSelector: "#password",
            loginSelector: "body > div > form > input.btn.btn-primary",
        }
        environment.setOutput("Extracted Data", JSON.stringify(mockExtractedData));

        // const openai = new OpenAI({
        //     apiKey: plainCredentialValue,
        // });

        // const response = await openai.chat.completions.create({
        //     model: 'gpt-4o-mini',
        //     messages: [
        //         {
        //             role: 'system',
        //             content: "You are a webscraper helper that extracts data from HTML or Text. You will be given a piece of text and HTML content as input and also the prompt with the data you have to extract.The response should always be only the extracted data as a JSON array or Object , without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found , return an empty JSON array.Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",

        //         },
        //         {
        //             role: 'user',
        //             content: content,
        //         },
        //         { role: 'user', content: prompt },
        //     ],
        //     temperature: 1,

        // });

        // environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
        // environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`);

        // const result = response.choices[0].message?.content;
        // if(!result) {
        //     environment.log.error("No Response from AI");
        //     return false;
        // }

        // environment.setOutput("Extracted Data", result);



        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}