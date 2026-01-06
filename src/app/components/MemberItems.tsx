"use client";

import { useState } from "react";
import { DeleteMemberButton } from "@/app/components/DeleteMemberBtn";
import { Button } from "@/app/components/ui/Button";

export default function MemberItem({ m, link }: { m: any, link: string }) {
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("Your AndonPro Credentials");
    const body = encodeURIComponent(
      `Hello ${m.member.name},\n\nHere are your login details:\nEmail: ${m.member.email}\nRole: ${m.role}\n\nPlease login Link : ${link}/login`
    );
    window.location.href = `mailto:${m.member.email}?subject=${subject}&body=${body}`;
  };

  // Fungsi untuk copy semua data sekaligus
  const copyAllData = () => {
    const textToCopy = `
DETAIL AKUN TEAM MEMBER:
-------------------------
Nama     : ${m.member.name}
Email    : ${m.member.email}
Password : ${m.lastPassword || "Belum diatur"}
Role     : ${m.role}
Link Login : ${link}login
-------------------------
Untuk kemanan, Kami sarankan untuk mengganti password.
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    alert("Semua data berhasil disalin!");
  };

  return (
    <>
      <div className="border-b border-border flex items-center justify-between py-2 group hover:bg-muted/50 transition-colors px-2">
        <p
          className="text-sm font-medium cursor-pointer hover:text-primary hover:underline transition-all"
          onClick={() => setShowModal(true)}
        >
          {m.member.name}
        </p>
        <DeleteMemberButton memberId={m.memberId} adminId={m.adminId} />
      </div>

      {/* Modal Detail */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
              <h3 className="font-bold tracking-widest text-sm">MEMBER DETAILS</h3>
              <button onClick={() => setShowModal(false)} className="hover:text-destructive-foreground/80 hover:bg-primary-foreground/20 rounded-full p-1 transition-colors">✕</button>
            </div>

            <div className="p-6 space-y-4 text-card-foreground">
              <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-3">
                <div>
                  <label className="text-[10px] text-muted-foreground block uppercase font-bold">Nama</label>
                  <p className="text-sm font-semibold">{m.member.name}</p>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block uppercase font-bold">Email</label>
                  <p className="text-sm font-mono">{m.member.email}</p>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block uppercase font-bold ">Password</label>
                  <p className="text-sm font-bold text-destructive">{m.lastPassword || "********"}</p>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block uppercase font-bold">Role</label>
                  <p className="inline-block bg-muted px-2 py-0.5 rounded text-[10px] font-bold border border-border">{m.role}</p>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground block uppercase font-bold">Link</label>
                  <p className="inline-block bg-muted px-2 py-0.5 rounded text-[10px] font-bold border border-border text-muted-foreground break-all">{link}login</p>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  onClick={copyAllData}
                  className="bg-green-600 hover:bg-green-700 text-white w-full text-xs"
                  size="sm"
                >
                  <span className="mr-2">📋</span> COPY ALL DATA
                </Button>
                <Button
                  onClick={() => {
                    const subject = encodeURIComponent("Akun AndonPro Anda");
                    const body = encodeURIComponent(`Detail Akun:\nEmail: ${m.member.email}\nPassword: ${m.lastPassword}`);
                    window.location.href = `mailto:${m.member.email}?subject=${subject}&body=${body}`;
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white w-full text-xs"
                  size="sm"
                >
                  <span className="mr-2">📧</span> SEND EMAIL
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="w-full mt-2"
                size="sm"
              >
                CLOSE
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}