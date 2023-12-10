import { status } from "./error_codes";

export class dataProcessor {
    static simplifyMessage(message) {
        message = String(message);
        message = message.split(": ")[0];
        return message;
    }

    static checkType(data, type) {
        if (typeof data === type) {
            return status.ACCEPTED;
        } else {
            return status.NOT_ACCEPTABLE;
        }
    }

    static checkTypes(dataList, typeList) {
        if (dataList.length != typeList.length) {
            return status.BAD_REQUEST;
        }
        let result = status.ACCEPTED;

        for (let i = 0; i < dataList.length; i++) {
            result = dataProcessor.checkType(dataList[i], typeList[i]);

            if (result != status.ACCEPTED) {
                break;
            }
        }
        return result;
    }

    static missingValues(dataList, referenceList) {
        let result = [];
        for (const value of referenceList) {
            if (!dataList.includes(value)) {
                result.push(value);
            }
        }
        return result;
    }
}