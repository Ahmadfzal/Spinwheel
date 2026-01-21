import { SpinWheel } from "../components/SpinWheel";

export default function Page() {
  const user = {
    coins: 15000,
    freeSpins: 5
  };

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
      <SpinWheel user={user} />
    </main>
  );
}
