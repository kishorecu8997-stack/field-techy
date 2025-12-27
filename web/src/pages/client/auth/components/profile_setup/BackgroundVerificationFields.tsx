import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";

export const BackgroundVerificationFields = () => {
    return (
        <>
            <FileUpload
                name="governmentId"
                label="Government ID"
                placeholder="Government ID"
                required
            />
            <FileUpload
                name="certificate"
                label="Certificate"
                placeholder="Certificate"
                required
            />
        </>
    );
};
