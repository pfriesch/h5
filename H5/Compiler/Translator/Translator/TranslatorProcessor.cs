using H5.Contract;
using Microsoft.Extensions.Logging;
using H5.Translator.Utils;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using Mosaik.Core;

namespace H5.Translator
{
    public class TranslatorProcessor
    {
        private static ILogger Logger = ApplicationLogging.CreateLogger<TranslatorProcessor>();

        public H5Options H5Options { get; private set; }


        public IAssemblyInfo TranslatorConfiguration { get; private set; }

        public Translator Translator { get; private set; }

        public TranslatorProcessor(H5Options h5Options)
        {
            this.H5Options = h5Options;
        }

        public void PreProcess()
        {
            this.AdjustH5Options();

            this.TranslatorConfiguration = this.ReadConfiguration();

            this.Translator = this.SetTranslatorProperties();

            Logger.LogInformation($"Ready to build {this.H5Options.ProjectLocation}");
        }

        private void AdjustH5Options()
        {
            var pathHelper = new ConfigHelper();
            var h5Options = this.H5Options;

            h5Options.H5Location = pathHelper.ConvertPath(h5Options.H5Location);
            h5Options.DefaultFileName = pathHelper.ConvertPath(h5Options.DefaultFileName);
            h5Options.OutputLocation = pathHelper.ConvertPath(h5Options.OutputLocation);
            h5Options.ProjectLocation = pathHelper.ConvertPath(h5Options.ProjectLocation);
            h5Options.ProjectProperties.OutputPath = pathHelper.ConvertPath(h5Options.ProjectProperties.OutputPath);
            h5Options.ProjectProperties.OutDir = pathHelper.ConvertPath(h5Options.ProjectProperties.OutDir);
        }

        public void Process()
        {
            this.Translator.Translate();
        }

        public string PostProcess()
        {
            var h5Options = this.H5Options;
            var translator = this.Translator;

            Logger.LogInformation("Post processing...");

            var outputPath = GetOutputFolder();

            Logger.LogInformation("outputPath is " + outputPath);

            translator.CleanOutputFolderIfRequired(outputPath);

            translator.PrepareResourcesConfig();

            var projectPath = Path.GetDirectoryName(translator.Location);
            Logger.LogInformation("projectPath is " + projectPath);

            translator.ExtractCore(outputPath, projectPath);

            var fileName = GetDefaultFileName(h5Options);
            if (!h5Options.SkipEmbeddingResources)
            {
                translator.Minify();
                translator.Combine(fileName);
                translator.Save(outputPath, fileName);
                translator.InjectResources(outputPath, projectPath);
            }

            translator.RunAfterBuild();

            Logger.LogInformation("Run plugins AfterOutput...");
            translator.Plugins.AfterOutput(translator, outputPath);
            Logger.LogInformation("Done plugins AfterOutput");

            this.GenerateHtml(outputPath);

            translator.Report(outputPath);

            Logger.LogInformation("Done post processing");

            return outputPath;
        }

        private void GenerateHtml(string outputPath)
        {
            var htmlTitle = Translator.AssemblyInfo.Html.Title;

            if (string.IsNullOrEmpty(htmlTitle))
            {
                htmlTitle = Translator.GetAssemblyTitle();
            }

            var htmlGenerator = new HtmlGenerator(Translator.AssemblyInfo, Translator.Outputs, htmlTitle);

            htmlGenerator.GenerateHtml(outputPath);
        }

        private string GetDefaultFileName(H5Options h5Options)
        {
            var defaultFileName = this.Translator.AssemblyInfo.FileName;

            if (string.IsNullOrEmpty(defaultFileName))
            {
                defaultFileName = h5Options.DefaultFileName;
            }

            if (string.IsNullOrEmpty(defaultFileName))
            {
                return AssemblyInfo.DEFAULT_FILENAME;
            }

            return Path.GetFileNameWithoutExtension(defaultFileName);
        }

        private string GetOutputFolder(bool basePathOnly = false, bool strict = false)
        {
            var h5Options = this.H5Options;
            string basePath = Path.GetDirectoryName(h5Options.ProjectLocation);

            if (!basePathOnly)
            {
                string assemblyOutput = string.Empty;

                if (this.Translator != null)
                {
                    assemblyOutput = this.Translator.AssemblyInfo.Output;
                }
                else if (this.TranslatorConfiguration != null)
                {
                    assemblyOutput = this.TranslatorConfiguration.Output;
                }
                else if (strict)
                {
                    throw new InvalidOperationException("Could not get output folder as assembly configuration is still null");
                }
                else
                {
                    Logger.LogWarning("Could not get assembly output folder");
                }

                basePath = string.IsNullOrWhiteSpace(assemblyOutput)
                    ? Path.Combine(basePath, Path.GetDirectoryName(h5Options.OutputLocation))
                    : Path.Combine(basePath, assemblyOutput);
            }

            basePath = new ConfigHelper().ConvertPath(basePath);
            basePath = Path.GetFullPath(basePath);

            return basePath;
        }

        private IAssemblyInfo ReadConfiguration()
        {
            var h5Options = this.H5Options;
            var location = h5Options.ProjectLocation;
            var configReader = new AssemblyConfigHelper();
            return configReader.ReadConfig(location, h5Options.ProjectProperties.Configuration);
        }


        private Translator SetTranslatorProperties()
        {
            var h5Options = this.H5Options;
            var assemblyConfig = this.TranslatorConfiguration;

            Logger.LogTrace("Setting translator properties...");

            H5.Translator.Translator translator = null;

            // FIXME: detect by extension whether first argument is a project or DLL
            translator = new H5.Translator.Translator(h5Options.ProjectLocation, h5Options.FromTask);

            translator.ProjectProperties = h5Options.ProjectProperties;

            translator.AssemblyInfo = assemblyConfig;

            if (this.H5Options.ReferencesPath != null)
            {
                translator.AssemblyInfo.ReferencesPath = this.H5Options.ReferencesPath;
            }

            translator.OverflowMode = h5Options.ProjectProperties.CheckForOverflowUnderflow.HasValue ?
                (h5Options.ProjectProperties.CheckForOverflowUnderflow.Value ? OverflowMode.Checked : OverflowMode.Unchecked) : (OverflowMode?)null;

            if (string.IsNullOrEmpty(h5Options.H5Location))
            {
                h5Options.H5Location = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "H5.dll");
            }

            translator.H5Location = h5Options.H5Location;
            translator.Rebuild = h5Options.Rebuild;

            if (h5Options.ProjectProperties.DefineConstants != null)
            {
                translator.DefineConstants.AddRange(h5Options.ProjectProperties.DefineConstants.Split(';').Select(s => s.Trim()).Where(s => s != ""));
                translator.DefineConstants = translator.DefineConstants.Distinct().ToList();
            }

           Logger.LogTrace("Translator properties:");
           Logger.LogTrace("\tH5Location:" + translator.H5Location);
           Logger.LogTrace("\tBuildArguments:" + translator.BuildArguments);
           Logger.LogTrace("\tDefineConstants:" + (translator.DefineConstants != null ? string.Join(" ", translator.DefineConstants) : ""));
           Logger.LogTrace("\tRebuild:" + translator.Rebuild);
           Logger.LogTrace("\tProjectProperties:" + translator.ProjectProperties);

            translator.EnsureProjectProperties();

            translator.ApplyProjectPropertiesToConfig();

            Logger.LogTrace("Setting translator properties done");

            return translator;
        }
    }
}