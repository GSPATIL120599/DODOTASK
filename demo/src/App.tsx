import { useState, useEffect } from "react";
import { DodoCheckout } from "../../sdk/index";
import { demoProducts, type DemoProduct } from "./data/products";
import { Navbar } from "./components/Navbar";
import { NotificationBanner, type ReturnNotification } from "./components/NotificationBanner";
import { ProductSpotlight } from "./components/ProductSpotlight";
import { ProductCatalog } from "./components/ProductCatalog";
import { CallbackLog, type LogEntry } from "./components/CallbackLog";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct>(demoProducts[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [notification, setNotification] = useState<ReturnNotification>(null);

  const categories = ["All", "Courses", "Developer Tools", "Design"];

  const filteredProducts =
    selectedCategory === "All"
      ? demoProducts
      : demoProducts.filter((p) => p.category === selectedCategory);

  const addLog = (type: LogEntry["type"], title: string, message: string) => {
    setLogs((prev) => [
      { id: Date.now() + Math.random(), type, title, message, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const sessionId = params.get("sessionId");
    const code = params.get("code");
    const message = params.get("message");
    const returnedProdId = params.get("productId");

    if (returnedProdId) {
      const match = demoProducts.find((p) => p.id === returnedProdId);
      if (match) setSelectedProduct(match);
    }

    if (status === "success") {
      setNotification({
        type: "success",
        title: "Payment Completed Successfully!",
        message: `Your transaction was approved. Session ID: ${sessionId ?? "sess_verified"}.`,
        sessionId: sessionId ?? undefined,
        productId: returnedProdId ?? undefined,
      });
      addLog("success", "REDIRECT_SUCCESS", `Session: ${sessionId ?? "N/A"} for ${returnedProdId ?? "product"}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === "declined") {
      setNotification({
        type: "error",
        title: "Payment Declined",
        message: message ?? "The card was declined by the simulated card issuer.",
        productId: returnedProdId ?? undefined,
      });
      addLog("error", "REDIRECT_DECLINED", `Status: declined (${code ?? "DECLINED"}: ${message ?? "Card declined"}).`);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === "cancelled") {
      setNotification({
        type: "info",
        title: "Checkout Cancelled",
        message: "You returned to the store without completing the payment.",
        productId: returnedProdId ?? undefined,
      });
      addLog("close", "REDIRECT_CANCELLED", "Customer returned without paying.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const getDemoRootUrl = () => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return `${window.location.origin}`;
    }
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    return `${window.location.origin}/${pathParts[0] ?? ""}/`;
  };

  const getCheckoutUrl = () => {
    if (import.meta.env.VITE_CHECKOUT_URL) return import.meta.env.VITE_CHECKOUT_URL;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5173";
    }
    // checkout is deployed as a subdirectory of the demo dist
    return `${getDemoRootUrl()}checkout/`;
  };

  const getReturnUrl = () => getDemoRootUrl();

  const handleBuyRedirect = () => {
    addLog("info", "REDIRECTING", `Navigating to checkout for "${selectedProduct.name}" ($${selectedProduct.price})...`);
    DodoCheckout.redirectToCheckout({
      productId: selectedProduct.id,
      checkoutUrl: getCheckoutUrl(),
      returnUrl: getReturnUrl(),
    });
  };

  const handleBuyModal = () => {
    addLog("info", "OPEN_MODAL", `Opening checkout modal for "${selectedProduct.name}"...`);
    DodoCheckout.open({
      productId: selectedProduct.id,
      checkoutUrl: getCheckoutUrl(),
      returnUrl: getReturnUrl(),
      onSuccess: ({ sessionId }) => {
        addLog("success", "DODO_SUCCESS", `Session ID: ${sessionId}`);
        setNotification({
          type: "success",
          title: "Payment Successful (Modal)",
          message: `Session: ${sessionId}. Access unlocked for ${selectedProduct.name}.`,
          sessionId,
        });
      },
      onClose: ({ reason }) => {
        addLog("close", "DODO_CLOSE", `Modal dismissed. Reason: ${reason}`);
      },
      onError: ({ code, message }) => {
        addLog("error", "DODO_ERROR", `${code}: ${message}`);
      },
    });
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f8fafc] text-[#0f172a]">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -right-32 top-32 h-[400px] w-[400px] rounded-full bg-indigo-300/15 blur-3xl" />
        <div className="absolute bottom-[-150px] left-1/3 h-[450px] w-[450px] rounded-full bg-cyan-200/15 blur-3xl" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8 space-y-6">
        <NotificationBanner notification={notification} onDismiss={() => setNotification(null)} />

        <ProductSpotlight
          product={selectedProduct}
          onBuyRedirect={handleBuyRedirect}
          onBuyModal={handleBuyModal}
        />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <ProductCatalog
            products={filteredProducts}
            selectedProduct={selectedProduct}
            selectedCategory={selectedCategory}
            categories={categories}
            onSelectCategory={setSelectedCategory}
            onSelectProduct={setSelectedProduct}
          />

          <CallbackLog logs={logs} onClear={() => setLogs([])} />
        </div>
      </div>

      <footer className="relative z-10 border-t border-slate-200/60 bg-white/50 px-4 py-5 text-center text-xs text-slate-400 backdrop-blur-md">
        <p>Demo Store · Built with Dodo Payments Checkout SDK</p>
      </footer>
    </main>
  );
}
