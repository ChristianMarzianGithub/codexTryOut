#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}/.."
BUILD_DIR="${PROJECT_ROOT}/build"
CLASSES_DIR="${BUILD_DIR}/classes"
JAR_PATH="${BUILD_DIR}/fittrack-backend.jar"

rm -rf "${BUILD_DIR}"
mkdir -p "${CLASSES_DIR}"

find "${PROJECT_ROOT}/src/main/java" -name "*.java" > "${BUILD_DIR}/sources.list"
if [ ! -s "${BUILD_DIR}/sources.list" ]; then
  echo "No Java sources found" >&2
  exit 1
fi

javac --release 17 -d "${CLASSES_DIR}" @"${BUILD_DIR}/sources.list"
cat <<MANIFEST > "${BUILD_DIR}/manifest.mf"
Main-Class: com.fittrack.backend.FitTrackApplication
Class-Path: .
MANIFEST

jar cfm "${JAR_PATH}" "${BUILD_DIR}/manifest.mf" -C "${CLASSES_DIR}" .
echo "Packaged backend to ${JAR_PATH}"
