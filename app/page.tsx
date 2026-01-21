import { SpinWheel } from "../components/SpinWheel";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a"
      }}
    >
      <SpinWheel />
    </main>
  );
}
