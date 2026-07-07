using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace H5.Compiler.IntegrationTests.StandardLibrary
{
    /// <summary>
    /// Reproduction tests for the "array-typed members dropped on deserialization" bug in
    /// H5.Newtonsoft.Json (see TODO / JsonConvert.js `needReuse`).
    ///
    /// When a C# object has an array property/field with a default initializer
    /// (e.g. <c>= Array.Empty&lt;T&gt;()</c>), the deserializer treats the member as
    /// reusable (ObjectCreationHandling.Auto + non-null current value), builds the correct
    /// array, but then throws it away — leaving the initialized empty array in place.
    ///
    /// These tests assert the *correct* Newtonsoft behaviour, so the regression cases
    /// currently FAIL against the published package and will pass once the fix lands.
    /// They use <c>skipRoslyn: true</c> because the Roslyn side of the harness does not
    /// reference Newtonsoft.Json (mirrors the WebApiTests pattern).
    /// </summary>
    [TestClass]
    public class JsonDeserializationTests : IntegrationTestBase
    {
        // 1. Array property WITH default initializer round-trips non-empty JSON. (The regression.)
        [TestMethod]
        public async Task ArrayPropertyWithInitializer_RoundTripsElements()
        {
            var code = @"
            using System;
            using Newtonsoft.Json;

            public class InstalledPackageVersion
            {
                public string Number { get; set; }
            }

            public class InstalledPackage
            {
                public string Id { get; set; }
                public InstalledPackageVersion[] Versions { get; set; } = Array.Empty<InstalledPackageVersion>();
            }

            public class Program
            {
                public static void Main()
                {
                    var json = ""{\""Id\"":\""serilog\"",\""Versions\"":[{\""Number\"":\""1.0\""},{\""Number\"":\""2.0\""}]}"";
                    var pkg = JsonConvert.DeserializeObject<InstalledPackage>(json);

                    Console.WriteLine(""Id="" + pkg.Id);
                    Console.WriteLine(""Count="" + pkg.Versions.Length);
                    foreach (var v in pkg.Versions)
                    {
                        Console.WriteLine(""Version="" + v.Number);
                    }
                }
            }";

            var output = await RunTest(code, skipRoslyn: true, includeCorePackages: true);
            Assert.AreEqual("Id=serilog\nCount=2\nVersion=1.0\nVersion=2.0", output);
        }

        // 2. Array property WITHOUT initializer still works (guard against regressions).
        [TestMethod]
        public async Task ArrayPropertyWithoutInitializer_Works()
        {
            var code = @"
            using System;
            using Newtonsoft.Json;

            public class InstalledPackageVersion
            {
                public string Number { get; set; }
            }

            public class InstalledPackage
            {
                public string Id { get; set; }
                public InstalledPackageVersion[] Versions { get; set; }
            }

            public class Program
            {
                public static void Main()
                {
                    var json = ""{\""Id\"":\""serilog\"",\""Versions\"":[{\""Number\"":\""1.0\""},{\""Number\"":\""2.0\""}]}"";
                    var pkg = JsonConvert.DeserializeObject<InstalledPackage>(json);

                    Console.WriteLine(""Id="" + pkg.Id);
                    Console.WriteLine(""Count="" + pkg.Versions.Length);
                    foreach (var v in pkg.Versions)
                    {
                        Console.WriteLine(""Version="" + v.Number);
                    }
                }
            }";

            var output = await RunTest(code, skipRoslyn: true, includeCorePackages: true);
            Assert.AreEqual("Id=serilog\nCount=2\nVersion=1.0\nVersion=2.0", output);
        }

        // 3. List<T> property with initializer still works (must remain reuse-in-place).
        [TestMethod]
        public async Task ListPropertyWithInitializer_Works()
        {
            var code = @"
            using System;
            using System.Collections.Generic;
            using Newtonsoft.Json;

            public class InstalledPackageVersion
            {
                public string Number { get; set; }
            }

            public class InstalledPackage
            {
                public string Id { get; set; }
                public List<InstalledPackageVersion> Versions { get; set; } = new List<InstalledPackageVersion>();
            }

            public class Program
            {
                public static void Main()
                {
                    var json = ""{\""Id\"":\""serilog\"",\""Versions\"":[{\""Number\"":\""1.0\""},{\""Number\"":\""2.0\""}]}"";
                    var pkg = JsonConvert.DeserializeObject<InstalledPackage>(json);

                    Console.WriteLine(""Id="" + pkg.Id);
                    Console.WriteLine(""Count="" + pkg.Versions.Count);
                    foreach (var v in pkg.Versions)
                    {
                        Console.WriteLine(""Version="" + v.Number);
                    }
                }
            }";

            var output = await RunTest(code, skipRoslyn: true, includeCorePackages: true);
            Assert.AreEqual("Id=serilog\nCount=2\nVersion=1.0\nVersion=2.0", output);
        }

        // 4. T[] of complex element type nested inside a complex object (array member with initializer).
        [TestMethod]
        public async Task NestedComplexArrayWithInitializer_RoundTrips()
        {
            var code = @"
            using System;
            using Newtonsoft.Json;

            public class Dependency
            {
                public string Name { get; set; }
                public string Range { get; set; }
            }

            public class InstalledPackageVersion
            {
                public string Number { get; set; }
                public Dependency[] Dependencies { get; set; } = Array.Empty<Dependency>();
            }

            public class InstalledPackage
            {
                public string Id { get; set; }
                public InstalledPackageVersion[] Versions { get; set; } = Array.Empty<InstalledPackageVersion>();
            }

            public class Program
            {
                public static void Main()
                {
                    var json = ""{\""Id\"":\""serilog\"",\""Versions\"":[{\""Number\"":\""1.0\"",\""Dependencies\"":[{\""Name\"":\""dep\"",\""Range\"":\""^1\""}]}]}"";
                    var pkg = JsonConvert.DeserializeObject<InstalledPackage>(json);

                    Console.WriteLine(""Id="" + pkg.Id);
                    Console.WriteLine(""VersionCount="" + pkg.Versions.Length);
                    var v0 = pkg.Versions[0];
                    Console.WriteLine(""Number="" + v0.Number);
                    Console.WriteLine(""DepCount="" + v0.Dependencies.Length);
                    Console.WriteLine(""Dep="" + v0.Dependencies[0].Name + "":"" + v0.Dependencies[0].Range);
                }
            }";

            var output = await RunTest(code, skipRoslyn: true, includeCorePackages: true);
            Assert.AreEqual("Id=serilog\nVersionCount=1\nNumber=1.0\nDepCount=1\nDep=dep:^1", output);
        }

        // 5. ObjectCreationHandling.Reuse explicitly set on an array member.
        //    Real Newtonsoft cannot reuse fixed-size arrays, so it replaces them.
        [TestMethod]
        public async Task ExplicitReuseOnArrayMember_ReplacesArray()
        {
            var code = @"
            using System;
            using Newtonsoft.Json;

            public class InstalledPackageVersion
            {
                public string Number { get; set; }
            }

            public class InstalledPackage
            {
                public string Id { get; set; }

                [JsonProperty(ObjectCreationHandling = ObjectCreationHandling.Reuse)]
                public InstalledPackageVersion[] Versions { get; set; } = Array.Empty<InstalledPackageVersion>();
            }

            public class Program
            {
                public static void Main()
                {
                    var json = ""{\""Id\"":\""serilog\"",\""Versions\"":[{\""Number\"":\""1.0\""},{\""Number\"":\""2.0\""}]}"";
                    var pkg = JsonConvert.DeserializeObject<InstalledPackage>(json);

                    Console.WriteLine(""Id="" + pkg.Id);
                    Console.WriteLine(""Count="" + pkg.Versions.Length);
                    foreach (var v in pkg.Versions)
                    {
                        Console.WriteLine(""Version="" + v.Number);
                    }
                }
            }";

            var output = await RunTest(code, skipRoslyn: true, includeCorePackages: true);
            Assert.AreEqual("Id=serilog\nCount=2\nVersion=1.0\nVersion=2.0", output);
        }

        // 6. JsonConvert.PopulateObject into an object with an initialized array member.
        [TestMethod]
        public async Task PopulateObjectWithInitializedArray_FillsArray()
        {
            var code = @"
            using System;
            using Newtonsoft.Json;

            public class InstalledPackageVersion
            {
                public string Number { get; set; }
            }

            public class InstalledPackage
            {
                public string Id { get; set; }
                public InstalledPackageVersion[] Versions { get; set; } = Array.Empty<InstalledPackageVersion>();
            }

            public class Program
            {
                public static void Main()
                {
                    var json = ""{\""Id\"":\""serilog\"",\""Versions\"":[{\""Number\"":\""1.0\""},{\""Number\"":\""2.0\""}]}"";
                    var target = new InstalledPackage();
                    JsonConvert.PopulateObject(json, target);

                    Console.WriteLine(""Id="" + target.Id);
                    Console.WriteLine(""Count="" + target.Versions.Length);
                    foreach (var v in target.Versions)
                    {
                        Console.WriteLine(""Version="" + v.Number);
                    }
                }
            }";

            var output = await RunTest(code, skipRoslyn: true, includeCorePackages: true);
            Assert.AreEqual("Id=serilog\nCount=2\nVersion=1.0\nVersion=2.0", output);
        }
    }
}
