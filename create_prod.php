<?php

/**
 * PHP файл для сборки прод версии
 * 
 * Прод-версия будет создана в директории masdProd/ , которая будет находиться в той же директории что и dev-версия
 * Для создания прода перейдите в терминале в корень директории с dev-версией и введите команду:
 * > php -f create_prod.php
 */

$masdProdDirName = 'masdProd';

class WorkWithFiles {
    /** Файлы и директории, которые не должны попадать в прод */
    const PASS_FILES = array(
        './.idea',
        './css/src',
        './js/src',
        './html_components',
        './html_src',
        './node_modules',
        './.gitignore',
        './nodeScriptForTranslation.js',
        './create_prod.php',
        './gulpfile.js',
        './README.md',
        './INSTRUCTION.txt',
        './.git',
        './.DS_Store',
    );

    /**
     * Удаление директории с файлами
     * 
     * @param {string} $dirPath
     * 
     * @return {void}
     */
    public static function deleteDir($dirPath) {
        $files = glob($dirPath . '*', GLOB_MARK);
    
        foreach ($files as $file) {
            if (is_dir($file)) {
                self::deleteDir($file);
            } else {
                unlink($file);
            }
        }

        if (file_exists($dirPath)) {
            rmdir($dirPath);
        }
    }

    /**
     * Копирует директорию вместе со всем содержимим
     * 
     * @param {string} $src
     * @param {string} $dst
     * 
     * @return {void}
     */
    public static function dirRecursiveCopy($src, $dst) {
        if (is_dir($src)) {
            echo "--- CREATE DIR $dst\n";
            mkdir($dst);
            $files = scandir($src);
            
            foreach ($files as $fileName) {
                if ($fileName === '.' || $fileName === '..') {
                    continue;
                }

                $filePath = "$src$fileName";

                if (in_array($filePath, self::PASS_FILES)) {
                    continue;
                }

                if (is_dir($filePath)) {
                    self::dirRecursiveCopy($filePath . '/', "$dst/$fileName");
                    continue;
                }

                if (file_exists($src . $fileName)) {
                    echo "FILE: $src$fileName TO $dst/$fileName\n";

                    copy("$src$fileName", "$dst/$fileName");
                }
            }
        }
    }

    public static function getDirAbsolutePath($dirName) {
        return realpath('../') . "/$dirName";
    }
}

$prodAbsPath = WorkWithFiles::getDirAbsolutePath($masdProdDirName);

if (is_dir($prodAbsPath)) {
    /** Удаляем директорию в которую будет формироваться прод-версия сайта, если она существует */
    WorkWithFiles::deleteDir($prodAbsPath);
}

WorkWithFiles::dirRecursiveCopy('./', $prodAbsPath);

/** Install prod npm packages */
chdir("../$masdProdDirName");
var_dump(shell_exec("pwd"));
var_dump(shell_exec("npm install --only=prod"));

?>