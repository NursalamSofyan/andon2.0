"use client";

import { deleteTeamMember } from "@/app/actions/team-actions";
import { useState } from "react";
import { MdDeleteForever, MdAutoDelete } from "react-icons/md";
import { Button } from "@/app/components/ui/Button";

export function DeleteMemberButton({ memberId, adminId }: { memberId: string, adminId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus anggota ini?")) return;

    setIsDeleting(true);
    const result = await deleteTeamMember(memberId, adminId);

    if (!result.success) {
      alert(result.error);
      setIsDeleting(false);
    }
    // Jika sukses, revalidatePath akan otomatis mengupdate UI
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-destructive hover:text-destructive hover:bg-destructive/10 px-2 transition-opacity ${isDeleting ? 'opacity-30' : 'opacity-100'}`}
    >
      {isDeleting ? <MdAutoDelete size={20} /> : <MdDeleteForever size={20} />}
    </Button>
  );
}