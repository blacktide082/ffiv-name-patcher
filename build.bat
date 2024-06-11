@echo off

SET SITE_PACKAGES_CMD=python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())"
FOR /F "tokens=*" %%g IN ('%SITE_PACKAGES_CMD%') do (
    SET SITE_PACKAGES=%%g
)

pyinstaller --onefile --paths "%SITE_PACKAGES%" --add-data="hook.js:." --name ffiv-name-fixer .\main.py