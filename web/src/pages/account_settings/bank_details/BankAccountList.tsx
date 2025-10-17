import type { DrawerMenuProps } from "@/shared/components/Drawer"

const BankAccountList: React.FC<DrawerMenuProps> = ({ onMenuItemClick })=> {

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
        },  
    ]

    return (
        <div className="flex flex-col gap-2 h-full">
            <div className=" text-right text-teal-700 hover:underline cursor-pointer" onClick={()=> onMenuItemClick('addBankdetails')}>Add Bank</div>
            {
                bankDetails.map((bank, index) => (
                    <div key={index} className="flex flex-col bg-gray-200 p-4 rounded-xl">
                        <div className="flex flex-row justify-between">
                            <div className="text-lg font-semibold">{bank.bankName}</div>
                            <div className="text-teal-900 cursor-pointer underline" onClick={()=> onMenuItemClick('editBankdetails')}>Edit details</div>
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
