# Radar visualization for OpenSearch Dashboards

This is an OpenSearch Dashboards plugin that is used to visualize data in a radar chart.

## Installation

You can find the different versions of the plugins on the
[releases page on Github](https://github.com/bitergia-analytics/radar-vis-plugin/releases).

Copy the link of the asset you want to install and run the following command inside
`opensearch-dashboards/bin` folder of your `opensearch-dashboard` instance.

```
opensearch-dashboards-plugin install <url>
```

## Developing

In order to make changes to this plugin or contributing to it, please read the following
sections.

### Prerequisites

You will need `node.js` and `yarn` to build the plugin. You can use
[nvm](https://github.com/nvm-sh/nvm) to install the required node version
of this plugin.

### Setup

1. Download **OpenSearch Dashboards** source code for the version that matches the
   [OpenSearch Dashboards version specified in opensearch_dashboards.json](./opensearch_dashboards.json#L4).
   You can download it from their
   [release page](https://github.com/opensearch-project/OpenSearch-Dashboards/releases)
   or clone the repository. We recommend to follow the
   [OpenSearch Dashboards' developers guide](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/DEVELOPER_GUIDE.md#getting-started)
   to configure the environment.
1. Change your node version to the version specified in `.node-version` inside
   the **OpenSearch Dashboards** root directory. You can use `nvm` to do it.
1. Create a `plugins` directory inside the **OpenSearch Dashboards** source code
   directory, if `plugins` directory doesn't exist.
   ```
   cd OpenSearchDashboards
   mkdir plugins
   ```
1. Check out this repository into the `plugins` directory.
   ```
   git clone https://github.com/bitergia-analytics/radar-vis-plugin plugins
   ```
1. Install the dependencies.
   ```
   cd OpenSearchDashboards/plugins/radar-vis-plugin
   yarn osd bootstrap
   ```

### Build

To build the plugin's distributable zip simply run `yarn build`.

Example output: `./build/radar-vis-plugin-0.2.0_2.11.0.zip`

### Run

To run and test the built version of plugin run inside **OpenSearch-Dashboards**
folder the following command:

```
yarn start
```
