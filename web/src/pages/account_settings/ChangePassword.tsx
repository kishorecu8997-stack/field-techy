import { Button } from "@/shared/components/commonUI/Buttons"
import { PasswordInput } from "@/shared/components/commonUI/inputs"
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer"
import { useForm } from "react-hook-form"

const ChangePassword = () => {
    return (
        <div>
            <ChangePasswordFields />
        </div>
    )
}

export default ChangePassword


const ChangePasswordFields = () => {
    const FormCtx = useForm()
    const handleSubmit = (data: any) => {
        console.log(data)
    }
    return (
        <div className="h-full">
            <FormContainer methods={FormCtx} onSubmit={handleSubmit}>
                <PasswordInput
                    label="Current Password"
                    name="currentPassword"
                    placeholder="Enter your current password"
                />
                <PasswordInput
                    label="New Password"
                    name="newPassword"
                    placeholder="Enter your new password"
                />
                <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                />
                <Button type="submit" className="w-full bg-teal-800 hover:bg-teal-900 text-white">
                    Update Password
                </Button>
            </FormContainer>

        </div>
    )
}
