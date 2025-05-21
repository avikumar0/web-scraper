import { ExecutionEnvironment } from '@/types/executor';
import { AddPropertyToJsonTask } from '../task/AddPropertyToJson';

export async function AddPropertyToJsonExecutor(
    environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>,
):Promise<boolean>{
    try {
        const jsonData = environment.getInput("JSON");
        if(!jsonData) {
            environment.log.error("Input->JSON is not defined");
        }
        const propertyName = environment.getInput("Property Name");
        if(!propertyName) {
            environment.log.error("Input->Property Name is not defined");
        }
        const propertyValue = environment.getInput("Property Value");
        if(!propertyValue) {
            environment.log.error("Input->propertyValue is not defined");
        }
        
        const json = JSON.parse(jsonData);
        json[propertyName] = propertyValue;

        environment.setOutput("Updated JSON", JSON.stringify(json));
        return true;
    } catch (error:any) {
        environment.log.error(error.message);
        return false;
    }
}