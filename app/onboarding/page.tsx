import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      {/* Progress Bar (Visual only for now) */}
      <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-10">
        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
      </div>

      <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <Typography variant="h2" className="text-purple-900">
            Tanışalım!
          </Typography>
          <Typography variant="body-large" className="text-gray-600">
            Cinsiyetiniz nedir?
          </Typography>
        </div>

        <div className="grid gap-4">
          <Link href="/dashboard" className="group">
            <Card className="p-6 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-6 group-hover:bg-purple-50">
              <div className="bg-blue-100 p-4 rounded-full">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <Typography variant="h3" className="text-gray-700 group-hover:text-purple-900">
                Erkeğim
              </Typography>
              <ArrowRight className="ml-auto w-6 h-6 text-gray-300 group-hover:text-purple-600" />
            </Card>
          </Link>

          <Link href="/dashboard" className="group">
            <Card className="p-6 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-6 group-hover:bg-purple-50">
              <div className="bg-pink-100 p-4 rounded-full">
                <User className="w-8 h-8 text-pink-600" />
              </div>
              <Typography variant="h3" className="text-gray-700 group-hover:text-purple-900">
                Kadınım
              </Typography>
              <ArrowRight className="ml-auto w-6 h-6 text-gray-300 group-hover:text-purple-600" />
            </Card>
          </Link>
        </div>
        
        <div className="text-center pt-8">
           <Typography variant="caption" className="text-gray-400">
             Adım 1 / 5
           </Typography>
        </div>
      </div>
    </div>
  );
}
