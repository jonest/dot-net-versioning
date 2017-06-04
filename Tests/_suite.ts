import * as Assert from "assert";
import * as MockTest from "vsts-task-lib/mock-test";
import * as Path from "path";
import * as FS from "fs";
import * as Mocha from "mocha";

describe("VersionAssemblies", function() {
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
});