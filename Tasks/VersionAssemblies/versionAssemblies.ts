import * as tl from 'vsts-task-lib/task';
import * as sh from 'shelljs';
import * as fs from 'fs';
import * as os from 'os';

export class VersionAssemblies {
    public static async run() {
        try {
            tl.debug("Starting Version Assemblies step");

            // get the task inputs
            let filePattern: string = tl.getInput("filePattern", true);
            let versionNumber: string = tl.getInput("versionNumber", true);
            let versionPattern: string = tl.getInput("versionPattern", true);
            let assemblyInfoSuffix: string = tl.getInput("assemblyInfoSuffix", false);
            let failIfNoMatch: boolean = tl.getBoolInput("failIfNoMatch", false);

            let sourcePath: string = tl.getPathInput("sourcePath");
            if (!sourcePath || sourcePath.length === 0) {
                sourcePath = tl.getVariable("Build.SourcesDirectory");
            }
            tl.checkPath(sourcePath, "sourcePath");
            // clear leading and trailing quotes for paths with spaces
            sourcePath = sourcePath.replace(/"/g, "");

            let versionRegex: string;
            switch (versionPattern) {
                default:
                case "major-minor-patch-build": versionRegex = "\\d+\\.\\d+\\.\\d+\\.\\d+"; break;
                case "major-minor-patch": versionRegex = "\\d+\\.\\d+\\.\\d+"; break;
                case "major-minor": versionRegex = "\\d+\\.\\d+"; break;
            }

            let assemblyInfoVersionRegex: string = `AssemblyInformationalVersion\\("${versionRegex}"\\)`;

            tl.debug(`Using ${versionRegex} as the build regex`);
            
            let filesToReplace: string[] = tl.findMatch(sourcePath, filePattern);
            
            if (!filesToReplace || filesToReplace.length === 0) {
                let noFilesFoundMessage: string = `No matches for regex [${filePattern}] found in ${sourcePath}`;
                if (failIfNoMatch) {
                    tl.setResult(tl.TaskResult.Failed, noFilesFoundMessage);
                    process.exit(1);
                } else {
                    tl.warning(noFilesFoundMessage);
                }
            } else {
                for (let i = 0; i < filesToReplace.length; i++) {
                    let file: string = filesToReplace[i];
                    console.info(`Changing version in ${file}`);
                    
                    let contents: string = fs.readFileSync(file, 'utf8').toString();
                    let checkMatches: RegExpExecArray = new RegExp(versionRegex).exec(contents);
                    if (!checkMatches || checkMatches.length === 0) {
                        let noMatchesFoundMessage: string = `No matches for regex [${versionRegex}] found in file ${file}`;
                        if (failIfNoMatch) {
                            tl.setResult(tl.TaskResult.Failed, noMatchesFoundMessage);
                            process.exit(1);
                        } else {
                            tl.warning(noMatchesFoundMessage);
                        }
                    } else {
                        console.info(`${checkMatches.length} matches for regex [${versionRegex}] found in file ${file}`);
                        
                        console.info(`Setting version in ${file} to ${versionNumber}`);

                        let result: string = contents.replace(new RegExp(versionRegex, "g"), versionNumber);

                        if (assemblyInfoSuffix != null && assemblyInfoSuffix != '') {
                            let assemblyInfoVersion: string = `${versionNumber}${assemblyInfoSuffix}`;

                            console.info(`Setting informational version in ${file} to ${assemblyInfoVersion}`);

                            result = result.replace(new RegExp(assemblyInfoVersionRegex, "g"), `AssemblyInformationalVersion("${assemblyInfoVersion}")`);
                        }
                        
                        // make the file writable
                        sh.chmod(666, file);
                        fs.writeFileSync(file, result, 'utf8');
                    }
                }
                console.info(`Processed ${filesToReplace.length} files`);
            }
        }
        catch (err) {
            let msg = err;
            if (err.message) {
                msg = err.message;
            }
            tl.setResult(tl.TaskResult.Failed, msg);
        }
    }
}

VersionAssemblies.run();