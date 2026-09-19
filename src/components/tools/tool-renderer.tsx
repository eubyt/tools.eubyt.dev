"use client";

import { HashGenerator } from "./hash-generator";
import { Base64Tool } from "./base64-tool";
import { UrlEncodeTool } from "./url-encode-tool";
import { HexTextTool } from "./hex-text-tool";
import { JsonFormatterTool } from "./json-formatter-tool";
import { JsonMinifierTool } from "./json-minifier-tool";
import { JsonValidatorTool } from "./json-validator-tool";
import { JsonDiffTool } from "./json-diff-tool";
import { JsonYamlTool } from "./json-yaml-tool";
import { JsonXmlTool } from "./json-xml-tool";
import { JsonCsvTool } from "./json-csv-tool";
import { JsonTomlTool } from "./json-toml-tool";
import { HmacTool } from "./hmac-tool";
import { JwtDecoderTool } from "./jwt-decoder-tool";
import { JwtGeneratorTool } from "./jwt-generator-tool";
import { AesTool } from "./aes-tool";
import { BcryptTool } from "./bcrypt-tool";
import { RandomHashTool } from "./random-hash-tool";
import { UuidTool } from "./uuid-tool";
import { SlugTool } from "./slug-tool";

type ToolRendererProps = {
    toolId: string;
};

export function ToolRenderer({ toolId }: ToolRendererProps) {
    switch (toolId) {
        case "hash-gen":
            return <HashGenerator />;
        case "base64":
            return <Base64Tool />;
        case "url-encode":
            return <UrlEncodeTool />;
        case "hex-text":
            return <HexTextTool />;
        case "json-formatter":
            return <JsonFormatterTool />;
        case "json-minifier":
            return <JsonMinifierTool />;
        case "json-validator":
            return <JsonValidatorTool />;
        case "json-diff":
            return <JsonDiffTool />;
        case "json-yaml":
            return <JsonYamlTool />;
        case "json-xml":
            return <JsonXmlTool />;
        case "json-csv":
            return <JsonCsvTool />;
        case "json-toml":
            return <JsonTomlTool />;
        case "hmac":
            return <HmacTool />;
        case "jwt-decode":
            return <JwtDecoderTool />;
        case "jwt-generator":
            return <JwtGeneratorTool />;
        case "aes":
            return <AesTool />;
        case "bcrypt":
            return <BcryptTool />;
        case "random-hash":
            return <RandomHashTool />;
        case "uuid":
            return <UuidTool />;
        case "url-slug":
            return <SlugTool />;
        default:
            return <div>Tool not found</div>;
    }
}
