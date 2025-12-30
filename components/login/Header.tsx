import { getLabel } from "@/lib/translations";
import { useAppStore } from "@/context/AppStore";

export function Header() {
    const { language } = useAppStore();


    return (<div className="flex flex-col items-start text-left space-y-4">
        <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight text-neutral-600 mb-2">{getLabel("welcome", language)}</h1>
            <p className="text-muted-foreground text-sm mb-9">
                {getLabel("login_subtitle", language)}
            </p>
        </div>
    </div>)
}
