using H5.Contract;
using H5.Contract.Constants;
using Microsoft.Ajax.Utilities;
using Microsoft.Extensions.Logging;
using Mono.Cecil;
using Mosaik.Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace H5.Translator
{
    internal class HtmlGenerator
    {
        private static ILogger Logger = ApplicationLogging.CreateLogger<HtmlGenerator>();

        public IAssemblyInfo Config { get; set; }

        public TranslatorOutput Outputs { get; set; }

        public string AssemblyTitle { get; set; }

        public HtmlGenerator(IAssemblyInfo config, TranslatorOutput outputs, string assemblyTitle)
        {
            Config = config;
            Outputs = outputs;
            AssemblyTitle = assemblyTitle;
        }

        public void GenerateHtml(string outputPath)
        {
            Logger.LogTrace("GenerateHtml...");

            if (Config.Html.Disabled)
            {
                Logger.LogTrace("GenerateHtml skipped as disabled in config.");
                return;
            }

            var htmlTemplate = 
@"

<!DOCTYPE html>

<html lang='en' xmlns='http://www.w3.org/1999/xhtml'>
<head>
    <meta charset='utf-8' />
    <title>{title}</title>
    {css}
    {script}
</head>
<body>
</body>
</html>

";
            //ReadEmbeddedResource("H5.Translator.Resources.HtmlTemplate.html");
            Logger.LogTrace("Applying default html template");

            var tokenTitle = "{title}";
            var tokenCss = "{css}";
            var tokenScript = "{script}";

            var indexCss = htmlTemplate.IndexOf(tokenCss, StringComparison.InvariantCultureIgnoreCase);
            var indexScript = htmlTemplate.IndexOf(tokenScript, StringComparison.InvariantCultureIgnoreCase);

            var cssLinkTemplate = "<link rel=\"stylesheet\" href=\"{0}\">";
            var scriptTemplate = "<script src=\"{0}\"></script>";

            var indentCss = GetIndent(htmlTemplate, indexCss);
            var indentScript = GetIndent(htmlTemplate, indexScript);

            var cssBuffer = new StringBuilder();
            var jsBuffer = new StringBuilder();
            var jsMinBuffer = new StringBuilder();

            IEnumerable<TranslatorOutputItem> outputForHtml = Outputs.GetOutputs();

            if (Outputs.Resources.Count > 0)
            {
                outputForHtml = outputForHtml.Concat(Outputs.Resources);
            }

            var firstJs = true;
            var firstMinJs = true;
            var firstCss = true;

            foreach (var output in outputForHtml)
            {
                if (output.OutputType == TranslatorOutputType.JavaScript && indexScript >= 0)
                {
                    if (output.IsMinified)
                    {
                        if (!firstMinJs)
                        {
                            jsMinBuffer.Append(Emitter.NEW_LINE);
                            jsMinBuffer.Append(indentScript);
                        }

                        firstMinJs = false;

                        jsMinBuffer.Append(string.Format(scriptTemplate, output.GetOutputPath(outputPath, true)));
                    }
                    else
                    {
                        if (!firstJs)
                        {
                            jsBuffer.Append(Emitter.NEW_LINE);
                            jsBuffer.Append(indentScript);
                        }

                        firstJs = false;

                        jsBuffer.Append(string.Format(scriptTemplate, output.GetOutputPath(outputPath, true)));
                    }
                } else if (output.OutputType == TranslatorOutputType.StyleSheets && indexCss >= 0)
                {
                    if (!firstCss)
                    {
                        cssBuffer.Append(Emitter.NEW_LINE);
                        cssBuffer.Append(indentCss);
                    }

                    firstCss = false;

                    cssBuffer.Append(string.Format(cssLinkTemplate, output.GetOutputPath(outputPath, true)));
                }
            }

            var tokens = new Dictionary<string, string>()
            {
                { tokenTitle, AssemblyTitle },
                { tokenCss,  cssBuffer.ToString() },
                { tokenScript, jsBuffer.ToString() }
            };

            string htmlName = null;
            string htmlMinName = null;

            if (jsBuffer.Length > 0 || cssBuffer.Length > 0)
            {
                htmlName = "index.html";
            }

            if (jsMinBuffer.Length > 0)
            {
                htmlMinName = htmlName == null ? "index.html" : "index.min.html";
            }

            var configHelper = new ConfigHelper();

            if (htmlName != null)
            {
                var html = configHelper.ApplyTokens(tokens, htmlTemplate);

                htmlName = Path.Combine(outputPath, htmlName);
                File.WriteAllText(htmlName, html, Translator.OutputEncoding);
            }

            if (htmlMinName != null)
            {
                tokens[tokenScript] = jsMinBuffer.ToString();
                var html = configHelper.ApplyTokens(tokens, htmlTemplate);

                htmlMinName = Path.Combine(outputPath, htmlMinName);
                File.WriteAllText(htmlMinName, html, Translator.OutputEncoding);
            }

            Logger.LogTrace("GenerateHtml done");
        }

        private string GetIndent(string input, int index)
        {
            if (index <= 0 || input == null || index >= input.Length)
            {
                return "";
            }

            var indent = 0;

            while (index-- > 0)
            {
                if (input[index] != ' ')
                {
                    break;
                }

                indent++;
            }

            return new string(' ', indent);
        }

        private string ReadEmbeddedResource(string name)
        {
            var assembly = System.Reflection. Assembly.GetExecutingAssembly();

            using (Stream stream = assembly.GetManifestResourceStream(name))
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    return reader.ReadToEnd();
                }
            }
        }
    }
}