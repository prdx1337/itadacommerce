import TransactionService from "../services/transaction.service";

class TransactionController {
    // async createTr(dto: any) {
    //     let response = await TransactionService.createTr(dto);
    //     return response;
    // }
    async transactions() {
        let response = await TransactionService.transactions();
        return response;
    }

    async deleteTr(dto: any) {
        let response = await TransactionService.deleteTr(dto);
        return response;
    }

    async updateTr(dto: any) {
        let response = await TransactionService.updateTr(dto);
        return response;
    }

    async checkout(dto: any) {
        let response = await TransactionService.checkout(dto);
        return response;
    }
}

export default new TransactionController();
