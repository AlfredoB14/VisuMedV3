import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="VisuMed | Crear cuenta"
        description="Crea tu cuenta de médico en VisuMed"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
