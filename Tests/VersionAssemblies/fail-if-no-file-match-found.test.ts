import * as MockRun from "vsts-task-lib/mock-run";
import * as MockAnswer from "vsts-task-lib/mock-answer";
import * as Path from "path";
import * as FS from "fs";

// set up mock file and folder for test
let sourcePath: string = "testFiles";
let versionPattern: string = "major-minor";
let versionNumber: string = "7.20";

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
        "**\\SolutionInfo.*" : []
    }
};
taskMockRunner.setAnswers(answers);

taskMockRunner.setInput("filePattern", "**\\SolutionInfo.*");
taskMockRunner.setInput("versionNumber", versionNumber);
taskMockRunner.setInput("versionPattern", versionPattern);
taskMockRunner.setInput("assemblyInfoSuffix", "");
taskMockRunner.setInput("failIfNoMatch", "true");
taskMockRunner.setInput("sourcePath", sourcePath);

// Act
taskMockRunner.run();