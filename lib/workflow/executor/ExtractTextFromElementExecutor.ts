import { ExecutionEnvironment } from '@/types/executor';
import { ExtractTextFromElementType } from '../task/ExtractTextFromElement';
import * as cheerio from 'cheerio';

export async function ExtractTextFromElementExecutor(
    environment: ExecutionEnvironment<typeof ExtractTextFromElementType>,
):Promise<boolean>{
    try {
        const selector = environment.getInput("Selector");
        if(!selector) {
            environment.log.error("Selector not found");
            return false;
        }
        const html = environment.getInput("Html");
        if(!html) {
            environment.log.error("Html not found");
            return false;
        }
        const $ = cheerio.load(html);
        const element = $(selector);

        if(!element){
            environment.log.error("Element not found with selector:");
            return false;
        }

        const extractedText = $.text(element);
        if(!extractedText){
            environment.log.error("No text found in the element with selector:");
            return false;
        }

        environment.setOutput("Extracted Text", extractedText);


        return true;
    } catch (error:any) {
        environment.log.error( error.message);
        return false;
    }
}