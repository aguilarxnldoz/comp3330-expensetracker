import {Hono} from "hono";
import {requireAuth} from "../auth/requireAuth";
import {s3} from "../lib/s3";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const generateKey = (filename: string) => `uploads/${Date.now()}-${filename}`;

export const uploadRoute = new Hono().post("/sign", async (c) => {
    try {
        const err = await requireAuth(c);
        console.log(err);
        if (err) return err;

        const {filename, type} = await c.req.json();
        const key = generateKey(filename);

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: key,
            ContentType: type,
        });

        const uploadUrl = await getSignedUrl(s3, command, {expiresIn: 60});
        console.log("Successfuly pre-signed URL: ", uploadUrl);
        return c.json({uploadUrl, key});
    } catch (e) {
        return c.json({error: e});
    }
});
