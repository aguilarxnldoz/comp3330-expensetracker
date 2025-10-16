// const {uploadUrl, key} = await fetch("/api/upload/sign", {
//     method: "POST",
//     headers: {"Content-Type": "application/json"},
//     credentials: "include",
//     body: JSON.stringify({filename: file.name, type: file.type}),
// }).then((res) => res.json());

// await fetch(uploadUrl, {
//     method: "PUT",
//     headers: {"Content-Type": file.type},
//     body: file,
// });

// await fetch(`/api/expenses/${expenseId}`, {
//     method: "PUT",
//     headers: {"Content-Type": "application/json"},
//     credentials: "include",
//     body: JSON.stringify({fileKey: key}),
// });

"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Field, FieldSeparator, FieldSet, FieldGroup} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {useQueryClient, useMutation} from "@tanstack/react-query";
import {redirect} from "@tanstack/react-router";
const API = "/api";

export default function UploadExpenseForm({expenseId}: {expenseId: number}) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const tanstackQuery = useQueryClient();

    const uploadFile = useMutation({
        mutationFn: async ({file, expenseId}: {file: File; expenseId: number}) => {
            try {
                const presignedUrlResponse = await fetch(`${API}/upload/sign`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify({filename: file.name, type: file.type}),
                });

                if (!presignedUrlResponse.ok) throw new Error("Failure obtaining upload URL");

                const {uploadUrl, key} = await presignedUrlResponse.json();

                const uploadToS3Response = await fetch(uploadUrl, {
                    method: "PUT",
                    headers: {"Content-Type": file.type},
                    body: file,
                });

                if (!uploadToS3Response.ok) throw new Error("Failure uploading to S3");

                const saveFileKeyToDatabaseResponse = await fetch(`${API}/expenses/${expenseId}`, {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify({fileUrl: key}),
                });

                if (!saveFileKeyToDatabaseResponse.ok) throw new Error("File key unsavable");

                return {key};
            } catch (e) {
                console.error(e);
                throw redirect({
                    href: "/",
                });
            }
        },

        onSuccess: async () => {
            setUploadedFile(null);
            await Promise.all([tanstackQuery.invalidateQueries({queryKey: ["expenses"]}), tanstackQuery.invalidateQueries({queryKey: ["expenses", expenseId]})]);
        },
    });

    const handleSubmitFileToS3 = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!uploadedFile) return;
            uploadFile.mutate({file: uploadedFile, expenseId});
        } catch (e) {}
    };

    const setFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setUploadedFile(event.target.files?.[0] ?? null);
    };

    return (
        <>
            <section className="w-[50%] m-auto">
                <h3>Upload expense file</h3>
                <FieldSet>
                    <FieldGroup>
                        <form onSubmit={handleSubmitFileToS3}>
                            <Field>
                                <FieldSeparator />
                                <Input
                                    type="file"
                                    placeholder="Upload"
                                    onChange={setFile}
                                />
                                <Button
                                    id="submit-file"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </Field>
                        </form>
                    </FieldGroup>
                </FieldSet>
            </section>
        </>
    );
}
