import * as Assert from "assert";
import * as MockTest from "vsts-task-lib/mock-test";
import * as Path from "path";
import * as FS from "fs";
import * as Mocha from "mocha";

describe("VersionAssemblies", function() {
    after(() => {
        let testFilesFolder = Path.join(__dirname, "VersionAssemblies", "testFiles");
        if (FS.existsSync(testFilesFolder)) {
            FS.rmdir(testFilesFolder);
        }
    });

    afterEach(() => {
        let testFilesFolder = Path.join(__dirname, "VersionAssemblies", "testFiles");
        if (FS.existsSync(testFilesFolder)) {
            let testFile = Path.join(testFilesFolder, "SolutionInfo.cs");
            if (FS.existsSync(testFile)) {
                FS.unlinkSync(testFile);
            }
        }
    });

    describe("major-minor-patch-build", function() {
        it("should version correctly", (done: MochaDone) => {
            // Arrange
            let testPath: string = Path.join(__dirname, "VersionAssemblies" ,"major-minor-patch-build.test.js");
            let testRunner: MockTest.MockTestRunner = new MockTest.MockTestRunner(testPath);

            // Act
            testRunner.run();

            // Assert
            Assert(testRunner.succeeded, "versioning should have succeeded");
            Assert.equal(testRunner.warningIssues.length, 0, "should have no warnings");
            Assert.equal(testRunner.errorIssues.length, 0, "should have no errors");

            done();
        });

        it("should version with info suffix correctly", (done: MochaDone) => {
            // Arrange
            let testPath: string = Path.join(__dirname, "VersionAssemblies" ,"major-minor-patch-build-suffix.test.js");
            let testRunner: MockTest.MockTestRunner = new MockTest.MockTestRunner(testPath);

            // Act
            testRunner.run();

            // Assert
            Assert(testRunner.succeeded, "versioning should have succeeded");
            Assert.equal(testRunner.warningIssues.length, 0, "should have no warnings");
            Assert.equal(testRunner.errorIssues.length, 0, "should have no errors");

            done();
        });
    });

    describe("major-minor-patch", function() {
        it("should version correctly", (done: MochaDone) => {
            // Arrange
            let testPath: string = Path.join(__dirname, "VersionAssemblies" ,"major-minor-patch.test.js");
            let testRunner: MockTest.MockTestRunner = new MockTest.MockTestRunner(testPath);

            // Act
            testRunner.run();

            // Assert
            Assert(testRunner.succeeded, "versioning should have succeeded");
            Assert.equal(testRunner.warningIssues.length, 0, "should have no warnings");
            Assert.equal(testRunner.errorIssues.length, 0, "should have no errors");

            done();
        });

        it("should version with info suffix correctly", (done: MochaDone) => {
            // Arrange
            let testPath: string = Path.join(__dirname, "VersionAssemblies" ,"major-minor-patch-suffix.test.js");
            let testRunner: MockTest.MockTestRunner = new MockTest.MockTestRunner(testPath);

            // Act
            testRunner.run();

            // Assert
            Assert(testRunner.succeeded, "versioning should have succeeded");
            Assert.equal(testRunner.warningIssues.length, 0, "should have no warnings");
            Assert.equal(testRunner.errorIssues.length, 0, "should have no errors");

            done();
        });
    });

    describe("major-minor", function() {
        it("should version correctly", (done: MochaDone) => {
            // Arrange
            let testPath: string = Path.join(__dirname, "VersionAssemblies" ,"major-minor.test.js");
            let testRunner: MockTest.MockTestRunner = new MockTest.MockTestRunner(testPath);

            // Act
            testRunner.run();

            // Assert
            Assert(testRunner.succeeded, "versioning should have succeeded");
            Assert.equal(testRunner.warningIssues.length, 0, "should have no warnings");
            Assert.equal(testRunner.errorIssues.length, 0, "should have no errors");

            done();
        });

        it("should version with info suffix correctly", (done: MochaDone) => {
            // Arrange
            let testPath: string = Path.join(__dirname, "VersionAssemblies" ,"major-minor-suffix.test.js");
            let testRunner: MockTest.MockTestRunner = new MockTest.MockTestRunner(testPath);

            // Act
            testRunner.run();

            // Assert
            Assert(testRunner.succeeded, "versioning should have succeeded");
            Assert.equal(testRunner.warningIssues.length, 0, "should have no warnings");
            Assert.equal(testRunner.errorIssues.length, 0, "should have no errors");

            done();
        });
    });

    describe("fail-if-no-match", function() {
        it("should fail if no file match is found ", (done: MochaDone) => {
            // Arrange
            let testPath: string = Path.join(__dirname, "VersionAssemblies" ,"fail-if-no-file-match-found.test.js");
            let testRunner: MockTest.MockTestRunner = new MockTest.MockTestRunner(testPath);

            // Act
            testRunner.run();

            // Assert
            Assert(testRunner.failed, "versioning should have failed");
            Assert.equal(testRunner.warningIssues.length, 0, "should have no warnings");
            Assert.equal(testRunner.errorIssues.length, 1, "should have 1 error");

            done();
        });

        it("should fail if no version match is found ", (done: MochaDone) => {
                // Arrange
                let testPath: string = Path.join(__dirname, "VersionAssemblies" ,"fail-if-no-version-match-found.test.js");
                let testRunner: MockTest.MockTestRunner = new MockTest.MockTestRunner(testPath);

                // Act
                testRunner.run();

                // Assert
                Assert(testRunner.failed, "versioning should have failed");
                Assert.equal(testRunner.warningIssues.length, 0, "should have no warnings");
                Assert.equal(testRunner.errorIssues.length, 1, "should have 1 error");

                done();
            });
    });
});