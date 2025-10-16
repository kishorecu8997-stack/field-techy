
const BankAccountList = () => {

    const bankDetails = [
        {
            bankName: "Bank of America",
            accountNumber: "1234567890",
            swiftcode: "1234567890",
            bankAddress: "1234 Main Street, Anytown, USA",
            iban: "1234567890",
            name: "John Doe",
        }, {
            bankName: "Bank of America",
            accountNumber: "1234567890",
            swiftcode: "1234567890",
            bankAddress: "1234 Main Street, Anytown, USA",
            iban: "1234567890",
            name: "John Doe",
        }, {
            bankName: "Banco do Brasil",
            accountNumber: "1234567890",
            swiftcode: "11111111",
            bankAddress: "1234 Main Street, Anytown, USA",
            iban: "222222222",
            name: "John Doe",
        },{
            bankName: "Bank of America",
            accountNumber: "1234567890",
            swiftcode: "1234567890",
            bankAddress: "1234 Main Street, Anytown, USA",
            iban: "1234567890",
            name: "John Doe",
        },{
            bankName: "Bank of America",
            accountNumber: "1234567890",
            swiftcode: "1234567890",
            bankAddress: "1234 Main Street, Anytown, USA",
            iban: "1234567890",
            name: "John Doe",
        },  {
            bankName: "BNP Paribas",
            accountNumber: "1234567890",
            swiftcode: "1234567890",
            bankAddress: "1234 Main Street, Anytown, USA",
            iban: "1234567890",
            name: "John Doe",
        }   
    ]

    return (
        <div className="flex flex-col gap-2">
            {
                bankDetails.map((bank, index) => (
                    <div key={index} className="flex flex-col bg-gray-200 p-4 rounded-xl">
                        <div className="flex flex-row justify-between">
                            <div className="text-lg font-semibold">{bank.bankName}</div>
                            <div className="text-teal-900 cursor-pointer underline">Edit details</div>
                        </div>
                        <div className="flex flex-row justify-between">Account Number: {bank.accountNumber}</div>
                        <div className="flex flex-row justify-between">SWIFT Code: {bank.swiftcode}</div>
                        <div className="flex flex-row justify-between">IBAN: {bank.iban}</div>
                    </div>
                ))
            }

        </div>
    )
}

export default BankAccountList
