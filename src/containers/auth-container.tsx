type Props = {
  children: React.ReactNode;
};

const AuthContainer = (props: Props) => {
  return (
    <main className="flex h-[100dvh] w-[100dvw] justify-center bg-LightGreyLightBg">
      {props.children}
    </main>
  );
};

export default AuthContainer;
