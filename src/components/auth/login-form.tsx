import Button from "@components/ui/button";
import { useLoginMutation } from "@framework/auth/use-login";
import { useUI } from "@contexts/ui.context";
import Logo from "@components/ui/logo";
import { ImGoogle2 } from "react-icons/im";
import { useTranslation } from "next-i18next";
import { signIn } from "next-auth/react";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useUI();
  const { isPending } = useLoginMutation();

  return (
    <div className="w-full px-5 py-5 mx-auto overflow-hidden bg-white border border-gray-300 rounded-lg sm:w-96 md:w-450px sm:px-8">
      <div className="text-center mb-6 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="mt-2 mb-8 text-sm md:text-base text-body sm:mb-10">
          {t("common:login-google-helper")}
        </p>
      </div>

      <Button
        loading={isPending}
        disabled={isPending}
        className="h-11 md:h-12 w-full mt-2.5 bg-google hover:bg-googleHover"
        onClick={() => signIn("google")}
      >
        <ImGoogle2 className="text-sm sm:text-base ltr:mr-1.5 rtl:ml-1.5" />
        {t("common:text-login-with-google")}
      </Button>
    </div>
  );
};

export default LoginForm;
