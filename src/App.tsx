import { MainLayout } from "./components/layout/main-layout";

export function App() {
    return (
        <MainLayout>
            <div className="space-y-6">
                <section className="bg-background p-8 rounded-xl shadow-sm border border-border text-center">
                    <h2 className="text-2xl font-semibold text-primary mb-2">Welcome</h2>

                    <p className="text-muted-foreground">
                        placeholder text.
                    </p>
                </section>
            </div>
        </MainLayout>
  );
}

export default App;