import { FileUpload, TextareaInput } from "@/shared/components/commonUI/inputs";
import SectionHeader from "../../SectionHeader";

const OtherDetailsSection = ({ isDisable }: { isDisable: boolean }) => {

    return (
        <div className="space-y-3">
            <SectionHeader title="Other Details" />
            <div className="flex flex-col w-full gap-3">
                <TextareaInput
                    name="otherInfo"
                    label="Additional Details"
                    placeholder="Add any additional guidelines or notes"
                    disabled={isDisable}
                />
                <FileUpload
                    name="attachment"
                    label="Additional Attachments (Guidelines, Docs)"
                    disabled={isDisable}
                />
            </div>
        </div>
    );
};

export default OtherDetailsSection;
