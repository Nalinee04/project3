@echo off

REM กำหนดตัวแปรสำหรับการเชื่อมต่อฐานข้อมูล
SET DB_USER=root
SET DB_PASSWORD=  REM ลบรหัสผ่านถ้าหากไม่มี
SET DB_NAME=db_res
SET BACKUP_DIR=C:\project3\restaurant\backups

REM เปลี่ยนเวลาให้ไม่มีช่องว่าง
SET TIME=%TIME: =0%

REM กำหนดชื่อไฟล์สำหรับการสำรองข้อมูล
SET DATE=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
SET BACKUP_FILE=%BACKUP_DIR%\%DB_NAME%_%DATE%.sql

REM สร้างโฟลเดอร์สำรองข้อมูลถ้ายังไม่มี
IF NOT EXIST %BACKUP_DIR% (
    mkdir %BACKUP_DIR%
)

REM ทำการสำรองข้อมูล (ลบ -p%DB_PASSWORD% ถ้าไม่มีรหัสผ่าน)
"C:\xampp\mysql\bin\mysqldump.exe" -u %DB_USER% %DB_NAME% > "%BACKUP_FILE%"

REM ตรวจสอบว่าการสำรองข้อมูลสำเร็จหรือไม่
IF ERRORLEVEL 1 (
    echo Backup failed
) ELSE (
    echo Backup successfully created at %BACKUP_FILE%
)

pause
