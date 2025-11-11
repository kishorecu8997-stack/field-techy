export interface TransactionProps {
transactionId: string;
clientDetails: ClientDetailsType;
jobTitle: string;
jobDescription: string;
amount: string;
engineerDetails: string;
paymentStatus: string;
}

export interface ClientDetailsType{
    name: string;
    email: string;
    phone: string;
}