import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Heart, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/home/ui-ux-practice")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>Hello "/ui-ux-practice"!</div>
      <div>
        <Heart />
        <Home />
        <Settings />
        <Heart size={32} color="red" strokeWidth={3} className="my-icon" />
        <Button variant="outline" size="sm">
          Button
        </Button>
      </div>

      <button
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={() => {
          toast("This is a toast");
          console.log("Toast should have been rendered");
        }}
      >
        Render toast
      </button>
      <button
        className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
        onClick={() => {
          toast.custom((t) => (
            <div className="bg-white shadow-lg rounded-xl p-4 flex items-center gap-3">
              <div className="text-green-500">✔</div>
              <div className="flex-1">
                <p className="font-semibold">성공!</p>
                <p className="text-sm text-gray-500">
                  데이터가 저장되었습니다.
                </p>
              </div>
              <button
                className="text-sm text-blue-500"
                onClick={() => toast.dismiss(t)}
              >
                닫기
              </button>
            </div>
          ));
        }}
      >
        커스텀 토스트1
      </button>
      <button
        className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
        onClick={() => {
          toast.custom((t) => (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              커스텀 토스트
            </div>
          ));
        }}
      >
        커스텀 토스트2
      </button>
    </>
  );
}
