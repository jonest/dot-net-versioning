import * as Assert from "assert";
import * as MockRun from "vsts-task-lib/mock-run";
import * as MockAnswer from "vsts-task-lib/mock-answer";
import * as Path from "path";
import * as FS from "fs";

// set up mock file and folder for test
let sourcePath: string = "testFiles";
let versionPattern: string = "major-minor-patch";

let originalVersionNumber: string = "1.0.0";
let versionNumber: string = "7.20.1969";

let testFilesFolder = Path.join(__dirname, sourcePath);
if (!FS.existsSync(testFilesFolder)) {
  FS.mkdirSync(testFilesFolder);
}
let tempFilePath = Path.join(testFilesFolder, "SolutionInfo.cs");

let taskPath: string = Path.join(__dirname, "../../Tasks", "VersionAssemblies", "versionAssemblies.js");
let taskMockRunner: MockRun.TaskMockRunner = new MockRun.TaskMockRunner(taskPath);

// provide answers for task mock
let answers: MockAnswer.TaskLibAnswers = <MockAnswer.TaskLibAnswers>{
    "checkPath": {
        "testFiles": true
    },
    "findMatch": {
        "**\\SolutionInfo.*" : [ tempFilePath ]
    }
};
taskMockRunner.setAnswers(answers);

let originalFile: string = `using System;
using System.Reflection;
using System.Resources;

[assembly: AssemblyCompany("TestCompany")]
[assembly: AssemblyProduct("TestProduct")]
[assembly: AssemblyCopyright("TestCopyright")]
[assembly: NeutralResourcesLanguage("en-US")]
[assembly: CLSCompliant(false)]

[assembly: AssemblyVersion("${originalVersionNumber}")]
[assembly: AssemblyFileVersion("${originalVersionNumber}")]
[assembly: AssemblyInformationalVersion("${originalVersionNumber}")]`;

FS.writeFile(tempFilePath, originalFile, (err) => {

    taskMockRunner.setInput("filePattern", "**\\SolutionInfo.*");
    taskMockRunner.setInput("versionNumber", versionNumber);
    taskMockRunner.setInput("versionPattern", versionPattern);
    taskMockRunner.setInput("assemblyInfoSuffix", "");
    taskMockRunner.setInput("failIfNoMatch", "false");
    taskMockRunner.setInput("sourcePath", sourcePath);

    // Act
    taskMockRunner.run();

    // Assert
    let expectedFile: string = `using System;
using System.Reflection;
using System.Resources;

[assembly: AssemblyCompany("TestCompany")]
[assembly: AssemblyProduct("TestProduct")]
[assembly: AssemblyCopyright("TestCopyright")]
[assembly: NeutralResourcesLanguage("en-US")]
[assembly: CLSCompliant(false)]

[assembly: AssemblyVersion("${versionNumber}")]
[assembly: AssemblyFileVersion("${versionNumber}")]
[assembly: AssemblyInformationalVersion("${versionNumber}")]`;

    let actualOutput = FS.readFileSync(tempFilePath, "utf-8").toString();
    Assert.equal(actualOutput.trim(), expectedFile.trim());
});