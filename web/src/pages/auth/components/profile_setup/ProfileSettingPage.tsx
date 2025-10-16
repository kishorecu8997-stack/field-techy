import ImageUploaderField from '@/shared/components/commonUI/inputs/ImageUploaderField';
import ProfileSetup from './ProfileSetup';

const ProfileSettingPage = () => {
  return (
    <>
      <div className="p-2 flex flex-col gap-2 items-center justify-center">
        <h2 className="text-3xl font-bold">Profile Setup</h2>
        <p className="text-md text-center text-gray-600 mb-6 px-3">
          Complete your profile to unlock opportunities.
        </p>
      </div>
      <div className="flex flex-row justify-center items-center">
        <div className="w-fit">
          <ImageUploaderField name="profileImage" />
        </div>
      </div>
      <div className="flex justify-center w-full">
        <ProfileSetup />
      </div>
    </>
  );
}

export default ProfileSettingPage
