import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="VisuMed | Inicio de sesión"
        description="Inicia sesión en tu cuenta de VisuMed"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
