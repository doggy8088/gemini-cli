<template><div><h1 id="how-to-contribute" tabindex="-1"><a class="header-anchor" href="#how-to-contribute"><span>How to Contribute</span></a></h1>
<p>We would love to accept your patches and contributions to this project.</p>
<h2 id="before-you-begin" tabindex="-1"><a class="header-anchor" href="#before-you-begin"><span>Before you begin</span></a></h2>
<h3 id="sign-our-contributor-license-agreement" tabindex="-1"><a class="header-anchor" href="#sign-our-contributor-license-agreement"><span>Sign our Contributor License Agreement</span></a></h3>
<p>Contributions to this project must be accompanied by a
<a href="https://cla.developers.google.com/about" target="_blank" rel="noopener noreferrer">Contributor License Agreement</a> (CLA).
You (or your employer) retain the copyright to your contribution; this simply
gives us permission to use and redistribute your contributions as part of the
project.</p>
<p>If you or your current employer have already signed the Google CLA (even if it
was for a different project), you probably don't need to do it again.</p>
<p>Visit <a href="https://cla.developers.google.com/" target="_blank" rel="noopener noreferrer">https://cla.developers.google.com/</a> to see your current agreements or to
sign a new one.</p>
<h3 id="review-our-community-guidelines" tabindex="-1"><a class="header-anchor" href="#review-our-community-guidelines"><span>Review our Community Guidelines</span></a></h3>
<p>This project follows <a href="https://opensource.google/conduct/" target="_blank" rel="noopener noreferrer">Google's Open Source Community
Guidelines</a>.</p>
<h2 id="contribution-process" tabindex="-1"><a class="header-anchor" href="#contribution-process"><span>Contribution Process</span></a></h2>
<h3 id="code-reviews" tabindex="-1"><a class="header-anchor" href="#code-reviews"><span>Code Reviews</span></a></h3>
<p>All submissions, including submissions by project members, require review. We
use <a href="https://docs.github.com/articles/about-pull-requests" target="_blank" rel="noopener noreferrer">GitHub pull requests</a>
for this purpose.</p>
<h3 id="pull-request-guidelines" tabindex="-1"><a class="header-anchor" href="#pull-request-guidelines"><span>Pull Request Guidelines</span></a></h3>
<p>To help us review and merge your PRs quickly, please follow these guidelines. PRs that do not meet these standards may be closed.</p>
<h4 id="_1-link-to-an-existing-issue" tabindex="-1"><a class="header-anchor" href="#_1-link-to-an-existing-issue"><span>1. Link to an Existing Issue</span></a></h4>
<p>All PRs should be linked to an existing issue in our tracker. This ensures that every change has been discussed and is aligned with the project's goals before any code is written.</p>
<ul>
<li><strong>For bug fixes:</strong> The PR should be linked to the bug report issue.</li>
<li><strong>For features:</strong> The PR should be linked to the feature request or proposal issue that has been approved by a maintainer.</li>
</ul>
<p>If an issue for your change doesn't exist, please <strong>open one first</strong> and wait for feedback before you start coding.</p>
<h4 id="_2-keep-it-small-and-focused" tabindex="-1"><a class="header-anchor" href="#_2-keep-it-small-and-focused"><span>2. Keep It Small and Focused</span></a></h4>
<p>We favor small, atomic PRs that address a single issue or add a single, self-contained feature.</p>
<ul>
<li><strong>Do:</strong> Create a PR that fixes one specific bug or adds one specific feature.</li>
<li><strong>Don't:</strong> Bundle multiple unrelated changes (e.g., a bug fix, a new feature, and a refactor) into a single PR.</li>
</ul>
<p>Large changes should be broken down into a series of smaller, logical PRs that can be reviewed and merged independently.</p>
<h4 id="_3-use-draft-prs-for-work-in-progress" tabindex="-1"><a class="header-anchor" href="#_3-use-draft-prs-for-work-in-progress"><span>3. Use Draft PRs for Work in Progress</span></a></h4>
<p>If you'd like to get early feedback on your work, please use GitHub's <strong>Draft Pull Request</strong> feature. This signals to the maintainers that the PR is not yet ready for a formal review but is open for discussion and initial feedback.</p>
<h4 id="_4-ensure-all-checks-pass" tabindex="-1"><a class="header-anchor" href="#_4-ensure-all-checks-pass"><span>4. Ensure All Checks Pass</span></a></h4>
<p>Before submitting your PR, ensure that all automated checks are passing by running <code v-pre>npm run preflight</code>. This command runs all tests, linting, and other style checks.</p>
<h4 id="_5-update-documentation" tabindex="-1"><a class="header-anchor" href="#_5-update-documentation"><span>5. Update Documentation</span></a></h4>
<p>If your PR introduces a user-facing change (e.g., a new command, a modified flag, or a change in behavior), you must also update the relevant documentation in the <code v-pre>/docs</code> directory.</p>
<h4 id="_6-write-clear-commit-messages-and-a-good-pr-description" tabindex="-1"><a class="header-anchor" href="#_6-write-clear-commit-messages-and-a-good-pr-description"><span>6. Write Clear Commit Messages and a Good PR Description</span></a></h4>
<p>Your PR should have a clear, descriptive title and a detailed description of the changes. Follow the <a href="https://www.conventionalcommits.org/" target="_blank" rel="noopener noreferrer">Conventional Commits</a> standard for your commit messages.</p>
<ul>
<li><strong>Good PR Title:</strong> <code v-pre>feat(cli): Add --json flag to 'config get' command</code></li>
<li><strong>Bad PR Title:</strong> <code v-pre>Made some changes</code></li>
</ul>
<p>In the PR description, explain the &quot;why&quot; behind your changes and link to the relevant issue (e.g., <code v-pre>Fixes #123</code>).</p>
<h2 id="forking" tabindex="-1"><a class="header-anchor" href="#forking"><span>Forking</span></a></h2>
<p>If you are forking the repository you will be able to run the Built, Test and Integration test workflows. However in order to make the integration tests run you'll need to add a <a href="%5Burl%5D(https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)">GitHub Repository Secret</a> with a value of <code v-pre>GEMINI_API_KEY</code> and set that to a valid API key that you have available. Your key and secret are private to your repo; no one without access can see your key and you cannot see any secrets related to this repo.</p>
<p>Additionally you will need to click on the <code v-pre>Actions</code> tab and enable workflows for your repository, you'll find it's the large blue button in the center of the screen.</p>
<h2 id="development-setup-and-workflow" tabindex="-1"><a class="header-anchor" href="#development-setup-and-workflow"><span>Development Setup and Workflow</span></a></h2>
<p>This section guides contributors on how to build, modify, and understand the development setup of this project.</p>
<h3 id="setting-up-the-development-environment" tabindex="-1"><a class="header-anchor" href="#setting-up-the-development-environment"><span>Setting Up the Development Environment</span></a></h3>
<p><strong>Prerequisites:</strong></p>
<ol>
<li>Install <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer">Node 18+</a></li>
<li>Git</li>
</ol>
<h3 id="build-process" tabindex="-1"><a class="header-anchor" href="#build-process"><span>Build Process</span></a></h3>
<p>To clone the repository:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">git</span> clone https://github.com/google-gemini/gemini-cli.git <span class="token comment"># Or your fork's URL</span></span>
<span class="line"><span class="token builtin class-name">cd</span> gemini-cli</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>To install dependencies defined in <code v-pre>package.json</code> as well as root dependencies:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>To build the entire project (all packages):</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run build</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>This command typically compiles TypeScript to JavaScript, bundles assets, and prepares the packages for execution. Refer to <code v-pre>scripts/build.js</code> and <code v-pre>package.json</code> scripts for more details on what happens during the build.</p>
<h3 id="enabling-sandboxing" tabindex="-1"><a class="header-anchor" href="#enabling-sandboxing"><span>Enabling Sandboxing</span></a></h3>
<p>Container-based <a href="#sandboxing">sandboxing</a> is highly recommended and requires, at a minimum, setting <code v-pre>GEMINI_SANDBOX=true</code> in your <code v-pre>~/.env</code> and ensuring a container engine (e.g. <code v-pre>docker</code> or <code v-pre>podman</code>) is available. See <a href="#sandboxing">Sandboxing</a> for details.</p>
<p>To build both the <code v-pre>gemini</code> CLI utility and the sandbox container, run <code v-pre>build:all</code> from the root directory:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run build:all</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>To skip building the sandbox container, you can use <code v-pre>npm run build</code> instead.</p>
<h3 id="running" tabindex="-1"><a class="header-anchor" href="#running"><span>Running</span></a></h3>
<p>To start the Gemini CLI from the source code (after building), run the following command from the root directory:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> start</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>If you’d like to run the source build outside of the gemini-cli folder you can utilize <code v-pre>npm link path/to/gemini-cli/packages/cli</code> (see: <a href="https://docs.npmjs.com/cli/v9/commands/npm-link" target="_blank" rel="noopener noreferrer">docs</a>) or <code v-pre>alias gemini=&quot;node path/to/gemini-cli/packages/cli&quot;</code> to run with <code v-pre>gemini</code></p>
<h3 id="running-tests" tabindex="-1"><a class="header-anchor" href="#running-tests"><span>Running Tests</span></a></h3>
<p>This project contains two types of tests: unit tests and integration tests.</p>
<h4 id="unit-tests" tabindex="-1"><a class="header-anchor" href="#unit-tests"><span>Unit Tests</span></a></h4>
<p>To execute the unit test suite for the project:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run <span class="token builtin class-name">test</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>This will run tests located in the <code v-pre>packages/core</code> and <code v-pre>packages/cli</code> directories. Ensure tests pass before submitting any changes. For a more comprehensive check, it is recommended to run <code v-pre>npm run preflight</code>.</p>
<h4 id="integration-tests" tabindex="-1"><a class="header-anchor" href="#integration-tests"><span>Integration Tests</span></a></h4>
<p>The integration tests are designed to validate the end-to-end functionality of the Gemini CLI. They are not run as part of the default <code v-pre>npm run test</code> command.</p>
<p>To run the integration tests, use the following command:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run test:e2e</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>For more detailed information on the integration testing framework, please see the <RouteLink to="/integration-tests.html">Integration Tests documentation</RouteLink>.</p>
<h3 id="linting-and-preflight-checks" tabindex="-1"><a class="header-anchor" href="#linting-and-preflight-checks"><span>Linting and Preflight Checks</span></a></h3>
<p>To ensure code quality and formatting consistency, run the preflight check:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run preflight</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>This command will run ESLint, Prettier, all tests, and other checks as defined in the project's <code v-pre>package.json</code>.</p>
<p><em>ProTip</em></p>
<p>after cloning create a git precommit hook file to ensure your commits are always clean.</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">"</span>
<span class="line"># Run npm build and check for errors</span>
<span class="line">if ! npm run preflight; then</span>
<span class="line">  echo "</span><span class="token function">npm</span> build failed. Commit aborted.<span class="token string">"</span>
<span class="line">  exit 1</span>
<span class="line">fi</span>
<span class="line">"</span> <span class="token operator">></span> .git/hooks/pre-commit <span class="token operator">&amp;&amp;</span> <span class="token function">chmod</span> +x .git/hooks/pre-commit</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="formatting" tabindex="-1"><a class="header-anchor" href="#formatting"><span>Formatting</span></a></h4>
<p>To separately format the code in this project by running the following command from the root directory:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run <span class="token function">format</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>This command uses Prettier to format the code according to the project's style guidelines.</p>
<h4 id="linting" tabindex="-1"><a class="header-anchor" href="#linting"><span>Linting</span></a></h4>
<p>To separately lint the code in this project, run the following command from the root directory:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run lint</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="coding-conventions" tabindex="-1"><a class="header-anchor" href="#coding-conventions"><span>Coding Conventions</span></a></h3>
<ul>
<li>Please adhere to the coding style, patterns, and conventions used throughout the existing codebase.</li>
<li>Consult <a href="https://github.com/google-gemini/gemini-cli/blob/main/GEMINI.md" target="_blank" rel="noopener noreferrer">GEMINI.md</a> (typically found in the project root) for specific instructions related to AI-assisted development, including conventions for React, comments, and Git usage.</li>
<li><strong>Imports:</strong> Pay special attention to import paths. The project uses <code v-pre>eslint-rules/no-relative-cross-package-imports.js</code> to enforce restrictions on relative imports between packages.</li>
</ul>
<h3 id="project-structure" tabindex="-1"><a class="header-anchor" href="#project-structure"><span>Project Structure</span></a></h3>
<ul>
<li><code v-pre>packages/</code>: Contains the individual sub-packages of the project.
<ul>
<li><code v-pre>cli/</code>: The command-line interface.</li>
<li><code v-pre>server/</code>: The backend server that the CLI interacts with.</li>
</ul>
</li>
<li><code v-pre>docs/</code>: Contains all project documentation.</li>
<li><code v-pre>scripts/</code>: Utility scripts for building, testing, and development tasks.</li>
</ul>
<p>For more detailed architecture, see <code v-pre>docs/architecture.md</code>.</p>
<h2 id="debugging" tabindex="-1"><a class="header-anchor" href="#debugging"><span>Debugging</span></a></h2>
<h3 id="vs-code" tabindex="-1"><a class="header-anchor" href="#vs-code"><span>VS Code:</span></a></h3>
<ol start="0">
<li>Run the CLI to interactively debug in VS Code with <code v-pre>F5</code></li>
<li>Start the CLI in debug mode from the root directory:<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> run debug</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>This command runs <code v-pre>node --inspect-brk dist/gemini.js</code> within the <code v-pre>packages/cli</code> directory, pausing execution until a debugger attaches. You can then open <code v-pre>chrome://inspect</code> in your Chrome browser to connect to the debugger.</li>
<li>In VS Code, use the &quot;Attach&quot; launch configuration (found in <code v-pre>.vscode/launch.json</code>).</li>
</ol>
<p>Alternatively, you can use the &quot;Launch Program&quot; configuration in VS Code if you prefer to launch the currently open file directly, but 'F5' is generally recommended.</p>
<p>To hit a breakpoint inside the sandbox container run:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token assign-left variable">DEBUG</span><span class="token operator">=</span><span class="token number">1</span> gemini</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="react-devtools" tabindex="-1"><a class="header-anchor" href="#react-devtools"><span>React DevTools</span></a></h3>
<p>To debug the CLI's React-based UI, you can use React DevTools. Ink, the library used for the CLI's interface, is compatible with React DevTools version 4.x.</p>
<ol>
<li>
<p><strong>Start the Gemini CLI in development mode:</strong></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token assign-left variable">DEV</span><span class="token operator">=</span>true <span class="token function">npm</span> start</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>Install and run React DevTools version 4.28.5 (or the latest compatible 4.x version):</strong></p>
<p>You can either install it globally:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-g</span> react-devtools@4.28.5</span>
<span class="line">react-devtools</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>Or run it directly using npx:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">npx react-devtools@4.28.5</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Your running CLI application should then connect to React DevTools.
<img src="@source/assets/connected_devtools.png" alt=""></p>
</li>
</ol>
<h2 id="sandboxing" tabindex="-1"><a class="header-anchor" href="#sandboxing"><span>Sandboxing</span></a></h2>
<h3 id="macos-seatbelt" tabindex="-1"><a class="header-anchor" href="#macos-seatbelt"><span>MacOS Seatbelt</span></a></h3>
<p>On MacOS, <code v-pre>gemini</code> uses Seatbelt (<code v-pre>sandbox-exec</code>) under a <code v-pre>permissive-open</code> profile (see <code v-pre>packages/cli/src/utils/sandbox-macos-permissive-open.sb</code>) that restricts writes to the project folder but otherwise allows all other operations and outbound network traffic (&quot;open&quot;) by default. You can switch to a <code v-pre>restrictive-closed</code> profile (see <code v-pre>.../sandbox-macos-strict.sb</code>) that declines all operations and outbound network traffic (&quot;closed&quot;) by default by setting <code v-pre>SEATBELT_PROFILE=restrictive-closed</code> in your environment or <code v-pre>.env</code> file. Available built-in profiles are <code v-pre>{permissive,restrictive}-{open,closed,proxied}</code> (see below for proxied networking). You can also switch to a custom profile <code v-pre>SEATBELT_PROFILE=&lt;profile&gt;</code> if you also create a file <code v-pre>.gemini/sandbox-macos-&lt;profile&gt;.sb</code> under your project settings directory <code v-pre>.gemini</code>.</p>
<h3 id="container-based-sandboxing-all-platforms" tabindex="-1"><a class="header-anchor" href="#container-based-sandboxing-all-platforms"><span>Container-based Sandboxing (All Platforms)</span></a></h3>
<p>For stronger container-based sandboxing on MacOS or other platforms, you can set <code v-pre>GEMINI_SANDBOX=true|docker|podman|&lt;command&gt;</code> in your environment or <code v-pre>.env</code> file. The specified command (or if <code v-pre>true</code> then either <code v-pre>docker</code> or <code v-pre>podman</code>) must be installed on the host machine. Once enabled, <code v-pre>npm run build:all</code> will build a minimal container (&quot;sandbox&quot;) image and <code v-pre>npm start</code> will launch inside a fresh instance of that container. The first build can take 20-30s (mostly due to downloading of the base image) but after that both build and start overhead should be minimal. Default builds (<code v-pre>npm run build</code>) will not rebuild the sandbox.</p>
<p>Container-based sandboxing mounts the project directory (and system temp directory) with read-write access and is started/stopped/removed automatically as you start/stop Gemini CLI. Files created within the sandbox should be automatically mapped to your user/group on host machine. You can easily specify additional mounts, ports, or environment variables by setting <code v-pre>SANDBOX_{MOUNTS,PORTS,ENV}</code> as needed. You can also fully customize the sandbox for your projects by creating the files <code v-pre>.gemini/sandbox.Dockerfile</code> and/or <code v-pre>.gemini/sandbox.bashrc</code> under your project settings directory (<code v-pre>.gemini</code>) and running <code v-pre>gemini</code> with <code v-pre>BUILD_SANDBOX=1</code> to trigger building of your custom sandbox.</p>
<h4 id="proxied-networking" tabindex="-1"><a class="header-anchor" href="#proxied-networking"><span>Proxied Networking</span></a></h4>
<p>All sandboxing methods, including MacOS Seatbelt using <code v-pre>*-proxied</code> profiles, support restricting outbound network traffic through a custom proxy server that can be specified as <code v-pre>GEMINI_SANDBOX_PROXY_COMMAND=&lt;command&gt;</code>, where <code v-pre>&lt;command&gt;</code> must start a proxy server that listens on <code v-pre>:::8877</code> for relevant requests. See <code v-pre>scripts/example-proxy.js</code> for a minimal proxy that only allows <code v-pre>HTTPS</code> connections to <code v-pre>example.com:443</code> (e.g. <code v-pre>curl https://example.com</code>) and declines all other requests. The proxy is started and stopped automatically alongside the sandbox.</p>
<h2 id="manual-publish" tabindex="-1"><a class="header-anchor" href="#manual-publish"><span>Manual Publish</span></a></h2>
<p>We publish an artifact for each commit to our internal registry. But if you need to manually cut a local build, then run the following commands:</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">npm run clean</span>
<span class="line">npm install</span>
<span class="line">npm run auth</span>
<span class="line">npm run prerelease:dev</span>
<span class="line">npm publish --workspaces</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


