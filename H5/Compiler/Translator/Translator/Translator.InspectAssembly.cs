#undef PARALLEL
using H5.Contract;
using ICSharpCode.NRefactory.CSharp;
using ICSharpCode.NRefactory.CSharp.TypeSystem;
using Mono.Cecil;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Concurrent;

namespace H5.Translator
{
    public partial class Translator
    {
        public Stack<string> CurrentAssemblyLocationInspected
        {
            get; set;
        } = new Stack<string>();

        private class CecilAssemblyResolver : DefaultAssemblyResolver
        {
            public ILogger Logger
            {
                get; set;
            }

            public CecilAssemblyResolver(ILogger logger, string location)
            {
                Logger = logger;

                ResolveFailure += CecilAssemblyResolver_ResolveFailure;

                AddSearchDirectory(Path.GetDirectoryName(location));
            }

            private AssemblyDefinition CecilAssemblyResolver_ResolveFailure(object sender, AssemblyNameReference reference)
            {
                string fullName = reference != null ? reference.FullName : "";
                Logger.LogTrace("CecilAssemblyResolver: ResolveFailure " + (fullName ?? ""));

                return null;
            }

            public override AssemblyDefinition Resolve(AssemblyNameReference name)
            {
                string fullName = name != null ? name.FullName : "";

                Logger.LogTrace("CecilAssemblyResolver: Resolve(AssemblyNameReference) " + (fullName ?? ""));

                return base.Resolve(name);
            }

            public override AssemblyDefinition Resolve(AssemblyNameReference name, ReaderParameters parameters)
            {
                string fullName = name != null ? name.FullName : "";

                Logger.LogTrace(
                    "CecilAssemblyResolver: Resolve(AssemblyNameReference, ReaderParameters) "
                    + (fullName ?? "")
                    + ", "
                    + (parameters != null ? parameters.ReadingMode.ToString() : "")
                    );

                return base.Resolve(name, parameters);
            }
        }

        protected virtual void LoadReferenceAssemblies(List<AssemblyDefinition> references)
        {
            var locations = GetProjectReferenceAssemblies().Distinct();

            foreach (var path in locations)
            {
                var ms = LoadAssemblyAsFileStream(path);
                {

                    var reference = AssemblyDefinition.ReadAssembly(
                        ms,
                        new ReaderParameters()
                        {
                            ReadingMode = ReadingMode.Deferred,
                            AssemblyResolver = new CecilAssemblyResolver(this.Log, AssemblyLocation)
                        }
                    );

                    if (reference != null && !references.Any(a => a.Name.Name == reference.Name.Name))
                    {
                        references.Add(reference);
                    }
                }
            }
        }

        protected virtual AssemblyDefinition LoadAssembly(string location, List<AssemblyDefinition> references)
        {
            this.Log.Trace("Assembly definition loading " + (location ?? "") + " ...");

            if (CurrentAssemblyLocationInspected.Contains(location))
            {
                var message = string.Format("There is a circular reference found for assembly location {0}. To avoid the error, rename your project's assembly to be different from that location.", location);

                this.Log.Error(message);
                throw new System.InvalidOperationException(message);
            }

            CurrentAssemblyLocationInspected.Push(location);

            var ms = LoadAssemblyAsFileStream(location);
            {
                var assemblyDefinition = AssemblyDefinition.ReadAssembly(
                        ms,
                        new ReaderParameters()
                        {
                            ReadingMode = ReadingMode.Deferred,
                            AssemblyResolver = new CecilAssemblyResolver(this.Log, AssemblyLocation)
                        }
                    );


                foreach (AssemblyNameReference r in assemblyDefinition.MainModule.AssemblyReferences)
                {
                    var name = r.Name;

                    if (name == SystemAssemblyName || name == "System.Core")
                    {
                        continue;
                    }

                    var fullName = r.FullName;

                    if (references.Any(a => a.Name.FullName == fullName))
                    {
                        continue;
                    }

                    var path = Path.Combine(Path.GetDirectoryName(location), name) + ".dll";

                    if(!File.Exists(path) && PackageReferencesDiscoveredPaths is object && PackageReferencesDiscoveredPaths.TryGetValue(name, out var discoveredPath))
                    {
                        path = discoveredPath;
                    }

                    var updateH5Location = name.ToLowerInvariant() == "h5" && (string.IsNullOrWhiteSpace(H5Location) || !File.Exists(H5Location));

                    if (updateH5Location)
                    {
                        H5Location = path;
                    }

                    var reference = LoadAssembly(path, references);

                    if (reference != null && !references.Any(a => a.Name.FullName == reference.Name.FullName))
                    {
                        references.Add(reference);
                    }
                }

                this.Log.Trace("Assembly definition loading " + (location ?? "") + " done");

                var cl = CurrentAssemblyLocationInspected.Pop();

                if (cl != location)
                {
                    throw new System.InvalidOperationException(string.Format("Current location {0} is not the current location in stack {1}", location, cl));
                }

                return assemblyDefinition;
            }
        }

        private static Stream LoadAssemblyAsFileStream(string location)
        {
            //Must be a FileStream, as it needs the path info attached
            return File.Open(location, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
        }

        protected virtual void ReadTypes(AssemblyDefinition assembly)
        {
            this.Log.Trace("Reading types for assembly " + (assembly != null && assembly.Name != null && assembly.Name.Name != null ? assembly.Name.Name : "") + " ...");

            AddNestedTypes(assembly.MainModule.Types);

            this.Log.Trace("Reading types for assembly done");
        }

        protected virtual void AddNestedTypes(IEnumerable<TypeDefinition> types)
        {
            bool skip_key;

            foreach (TypeDefinition type in types)
            {
                if (type.FullName.Contains("<"))
                {
                    continue;
                }

                Validator.CheckType(type, this);

                string key = H5Types.GetTypeDefinitionKey(type);

                H5Type duplicateH5Type = null;

                skip_key = false;
                if (H5Types.TryGetValue(key, out duplicateH5Type))
                {
                    var duplicate = duplicateH5Type.TypeDefinition;

                    var message = string.Format(
                        Constants.Messages.Exceptions.DUPLICATE_H5_TYPE,
                        type.Module.Assembly.FullName,
                        type.FullName,
                        duplicate.Module.Assembly.FullName,
                        duplicate.FullName);

                    if (!AssemblyInfo.IgnoreDuplicateTypes)
                    {
                        this.Log.Error(message);
                        throw new System.InvalidOperationException(message);
                    } else
                    {
                        this.Log.Warn(message);
                    }
                    skip_key = true;
                }

                if (!skip_key)
                {
                    TypeDefinitions.Add(key, type);

                    H5Types.Add(key, new H5Type(key)
                    {
                        TypeDefinition = type
                    });

                    if (type.HasNestedTypes)
                    {
                        Translator.InheritAttributes(type);
                        AddNestedTypes(type.NestedTypes);
                    }
                }
            }
        }

        /// <summary>
        /// Makes any existing nested types (classes?) inherit the FileName attribute of the specified type.
        /// Does not override a nested type's FileName attribute if present.
        /// </summary>
        /// <param name="type"></param>
        protected static void InheritAttributes(TypeDefinition type)
        {
            // List of attribute names that are meant to be inherited by sub-classes.
            var attrList = new List<string>
            {
                "FileNameAttribute",
                "ModuleAttribute",
                "NamespaceAttribute"
            };

            foreach (var attribute in attrList)
            {
                if (type.CustomAttributes.Any(ca => ca.AttributeType.Name == attribute))
                {
                    var FAt = type.CustomAttributes.First(ca => ca.AttributeType.Name == attribute);

                    foreach (var nestedType in type.NestedTypes)
                    {
                        if (!nestedType.CustomAttributes.Any(ca => ca.AttributeType.Name == attribute))
                        {
                            nestedType.CustomAttributes.Add(FAt);
                        }
                    }
                }
            }
        }

        protected virtual List<AssemblyDefinition> InspectReferences()
        {
            this.Log.Info("Inspecting references...");

            TypeInfoDefinitions = new Dictionary<string, ITypeInfo>();

            var references = new List<AssemblyDefinition>();
            var assembly = LoadAssembly(AssemblyLocation, references);
            LoadReferenceAssemblies(references);
            TypeDefinitions = new Dictionary<string, TypeDefinition>();
            H5Types = new H5Types();
            AssemblyDefinition = assembly;

            if (assembly.Name.Name != Translator.H5_ASSEMBLY || AssemblyInfo.Assembly != null && AssemblyInfo.Assembly.EnableReservedNamespaces)
            {
                ReadTypes(assembly);
            }

            foreach (var item in references)
            {
                ReadTypes(item);
            }

            var prefix = Path.GetDirectoryName(Location);

            for (int i = 0; i < SourceFiles.Count; i++)
            {
                SourceFiles[i] = Path.Combine(prefix, SourceFiles[i]);
            }

            this.Log.Info("Inspecting references done");

            return references;
        }

        protected virtual void InspectTypes(MemberResolver resolver, IAssemblyInfo config)
        {
            this.Log.Info("Inspecting types...");

            Inspector inspector = CreateInspector(config);
            inspector.AssemblyInfo = config;
            inspector.Resolver = resolver;

            for (int i = 0; i < ParsedSourceFiles.Length; i++)
            {
                var sourceFile = ParsedSourceFiles[i];
                this.Log.Trace("Visiting syntax tree " + (sourceFile != null && sourceFile.ParsedFile != null && sourceFile.ParsedFile.FileName != null ? sourceFile.ParsedFile.FileName : ""));

                inspector.VisitSyntaxTree(sourceFile.SyntaxTree);
            }

            AssemblyInfo = inspector.AssemblyInfo;
            Types = inspector.Types;

            this.Log.Info("Inspecting types done");
        }

        protected virtual Inspector CreateInspector(IAssemblyInfo config = null)
        {
            return new Inspector(config);
        }

        private string[] Rewrite()
        {
            var rewriter = new SharpSixRewriter(this);
            var result = new string[SourceFiles.Count];

            // Run in parallel only and only if logger level is not trace.
            if (this.Log.LoggerLevel == LoggerLevel.Trace)
            {
                this.Log.Trace("Rewriting/replacing code from files one after the other (not parallel) due to logger level being 'trace'.");
                SourceFiles.Select((file, index) => new { file, index }).ToList()
                    .ForEach(entry => result[entry.index] = new SharpSixRewriter(rewriter).Rewrite(entry.index));
            }
            else
            {
                var queue = new ConcurrentQueue<int>(Enumerable.Range(0, SourceFiles.Count));

                var threads = Enumerable.Range(0, Environment.ProcessorCount).Select(i =>
                 {
                     var t = new Thread(() =>
                     {
                         while(queue.TryDequeue(out var index))
                         {
                             result[index] = new SharpSixRewriter(rewriter).Rewrite(index);
                         }
                     });
                     t.IsBackground = true;
                     t.Start();
                     return t;
                 }).ToArray();

                Array.ForEach(threads, t => t.Join());
            }

            rewriter.CommitCache();

            return result;
        }

        protected void BuildSyntaxTree()
        {
            this.Log.Info("Building syntax tree...");

            var rewriten = Rewrite();

            // Run in parallel only and only if logger level is not trace.
            if (this.Log.LoggerLevel == LoggerLevel.Trace)
            {
                this.Log.Trace("Building syntax tree..." + Environment.NewLine + "Parsing files one after the other (not parallel) due to logger level being 'trace'.");
                for (var index = 0; index < SourceFiles.Count; index++)
                {
                    BuildSyntaxTreeForFile(index, ref rewriten);
                }
            }
            else
            {
                Task.WaitAll(SourceFiles.Select((fileName, index) => Task.Run(() => BuildSyntaxTreeForFile(index, ref rewriten))).ToArray());
            }

            this.Log.Info("Building syntax tree done");
        }

        private void BuildSyntaxTreeForFile(int index, ref string[] rewriten)
        {
            var fileName = SourceFiles[index];
            this.Log.Trace("Source file " + (fileName ?? string.Empty) + " ...");

            var parser = new ICSharpCode.NRefactory.CSharp.CSharpParser();

            if (DefineConstants != null && DefineConstants.Count > 0)
            {
                foreach (var defineConstant in DefineConstants)
                {
                    parser.CompilerSettings.ConditionalSymbols.Add(defineConstant);
                }
            }

            //RFO: Temp fix for invalid handling of A?.Method() being converted to A != null ? A.Method() : ()null
            if (rewriten[index].Contains("()null"))
            {
                rewriten[index] = rewriten[index].Replace("()null", "null");
            }

            var syntaxTree = parser.Parse(rewriten[index], fileName);
            syntaxTree.FileName = fileName;
            this.Log.Trace("\tParsing syntax tree done");

            if (parser.HasErrors)
            {
                var errors = new List<string>();
                foreach (var error in parser.Errors)
                {
                    errors.Add(fileName + ":" + error.Region.BeginLine + "," + error.Region.BeginColumn + ": " + error.Message);
                }

                throw new EmitterException(syntaxTree, "Error parsing code." + Environment.NewLine + String.Join(Environment.NewLine, errors));
            }

            var expandResult = new QueryExpressionExpander().ExpandQueryExpressions(syntaxTree);
            this.Log.Trace("\tExpanding query expressions done");

            syntaxTree = (expandResult != null ? (SyntaxTree)expandResult.AstNode : syntaxTree);

            var emptyLambdaDetecter = new EmptyLambdaDetecter();
            syntaxTree.AcceptVisitor(emptyLambdaDetecter);
            this.Log.Trace("\tAccepting lambda detector visitor done");

            if (emptyLambdaDetecter.Found)
            {
                var fixer = new EmptyLambdaFixer();
                var astNode = syntaxTree.AcceptVisitor(fixer);
                this.Log.Trace("\tAccepting lambda fixer visitor done");
                syntaxTree = (astNode != null ? (SyntaxTree)astNode : syntaxTree);
                syntaxTree.FileName = fileName;
            }

            var f = new ParsedSourceFile(syntaxTree, new CSharpUnresolvedFile
            {
                FileName = fileName
            });
            ParsedSourceFiles[index] = f;

            var tcv = new TypeSystemConvertVisitor(f.ParsedFile);
            f.SyntaxTree.AcceptVisitor(tcv);
            this.Log.Trace("\tAccepting type system convert visitor done");

            this.Log.Trace("Source file " + (fileName ?? string.Empty) + " done");
        }
    }
}