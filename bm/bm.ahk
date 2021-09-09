#NoEnv
#SingleInstance, Force
#Include <JSON>
#codepage=65001

SendMode, Input

global prestacion:= []
global PacienteSeleccionado = 0


FileDelete, D:\salida.json
FormatTime, fecha , % A_Now , yyyyMMdd
;MsgBox % fecha
Run "D:\dicomlib.exe" "mwl" %fecha%
sleep 1000
FileRead , jsonStr,  *P65001 D:\salida.json
Mwl := JSON.Load(jsonStr)

; alt+1
!1::
	if not WinExist("Endoscopia - Nuevo Estudio")
    {
		Gui, +AlwaysOnTop +ToolWindow
		Gui, Add, Picture, w100 h-1, d:\logo.png
		Gui,Font, s14 Bold
		Gui, Add, Text,xp+120 ys-0, Registro de Procedimientos de Endoscopia
		Gui, Add, Text,xp+0 ys+25, Aplicaciones Neuquinas de Salud
		Gui,Font, s12 Normal
		Gui,Font, s14 Bold
		Gui, Add, GroupBox, xp-120 ys+75 section w430 h95, Importante
        Gui,Font, s12 Norm
		Gui, Add, Text,xp+15 ys+30,Se debe iniciar la prestación para visualizar el Paciente.
        Gui, Add, Text,,Si no está agendado, iniciar fuera de agenda.
		Gui,Font, s14 Bold
        Gui, Add, GroupBox,xp-15 ys+105 section w430 h160, Selección de Lista de Trabajo
        Gui,Font, s12 norm
		Gui, Add, ListView, xp+15 ys+25 w400 h125 AltSubmit Grid vList gListaPacientes, Nombre|F.N.|Sex
		for i, obj in Mwl
		{

			LV_Add(i,obj.100010.Value[1].Alphabetic, obj.100030.Value[1], obj.100040.Value[1])  
		}
		LV_ModifyCol(1, "270")
		LV_ModifyCol(2, "80 Center")
		LV_ModifyCol(3, "45 Center")
        Gui, Add, Button,xp+15 ys+165, Iniciar 
		Gui, Add, Button,xp+155 ys+165, Refrescar
        Gui,Font, s14 Bold
		Gui, Add, GroupBox,xp+250 ys-105 section w430 h265, Información del Procedimiento
		Gui,Font, s12 Norm
		Gui, Add, Text ,xp+130 ys-45 , Fecha:
		Gui, Add, DateTime,xp+70 ys-51 w150 vMyDateTime, dd/MM/yyyy
		Gui,Font,cBlue 
		Gui, Add, Text,xp-170 ys+30, Profesional:
		Gui,Font,cDefault
		Gui, Add, Text,xp+90 ys+30 w300 vProf ,
		Gui,Font,cBlue 
		Gui, Add, Text,xp-90 ys+60, Agenda:
		Gui,Font,cDefault
		Gui, Add, Text,xp+70 ys+60 w300 vAgenda, 
		Gui,Font, s12 Underline 
		Gui, Add, Text,xp+0 ys+90, Datos del Paciente:
		Gui,Font, s12 Norm cBlue 
		Gui, Add, Text,xp-70 ys+120, Nombre:
		Gui,Font,cDefault
		Gui, Add, Text,xp+70 ys+120 w300 vPac, 
		Gui,Font,cBlue 
		Gui, Add, Text,xp-70 ys+150, ID:
		Gui,Font,cDefault
		Gui, Add, Text,xp+35 ys+150 w250 vDNI,
		Gui,Font,cBlue 
		Gui, Add, Text,xp-35 ys+180, Fecha de Nac.:
		Gui,Font,cDefault
		Gui, Add, Text,xp+110 ys+180 w150 vFN, 
		Gui,Font,cBlue 
		Gui, Add, Text,xp-110 ys+210, Sexo:
		Gui,Font,cDefault
		Gui, Add, Text,xp+50 w100 vSex,
		Gui, Add, Button,xs, Cerrar				
		Gui, Show,, Endoscopia - Nuevo Estudio

    }

return		

RemoveToolTip:
 	ToolTip
return

ListaPacientes:
if (A_GuiEvent = "F") || (A_GuiEvent = "DoubleClick")  || (A_GuiEvent = "Normal")
{

	LV_GetText(RowText, FocusedRowNumber)  ; Get the text from the row's first field.
    ToolTip Seleccionaste el Paciente %FocusedRowNumber%: "%RowText%"
	SetTimer, RemoveToolTip, -2000
	FocusedRowNumber := LV_GetNext(0, "F")
	GuiControl, Text, Prof , % Mwl[FocusedRowNumber].321032.Value[1].Alphabetic
	GuiControl, Text, Agenda , % Mwl[FocusedRowNumber].321060.Value[1]		
	GuiControl, Text, Pac  , % Mwl[FocusedRowNumber].100010.Value[1].Alphabetic		
	GuiControl, Text, DNI , % Mwl[FocusedRowNumber].100020.Value[1]
	GuiControl, Text, FN , % Mwl[FocusedRowNumber].100030.Value[1]
	GuiControl, Text, Sex , % Mwl[FocusedRowNumber].100040.Value[1]
	PacienteSeleccionado:= FocusedRowNumber
}
return

ButtonRefrescar:
	LV_Delete()
	Gui, Submit, NoHide
	FormatTime, fecha , % MyDateTime , yyyyMMdd    
	Run "D:\dicomlib.exe" "mwl" %fecha%
	Sleep 1000
	FileRead , jsonStr,  *P65001 D:\salida.json
	Mwl := JSON.Load(jsonStr)
	for i, obj in Mwl
		{
			;MsgBox,4096 ,, % obj.100010.Value[1].Alphabetic  obj.100030.Value[1] obj.100040.Value[1]
			LV_Add(i,obj.100010.Value[1].Alphabetic, obj.100030.Value[1], obj.100040.Value[1])  
		}
	LV_ModifyCol(1, "265")
	LV_ModifyCol(2, "90 Center")
	LV_ModifyCol(3, "45 Center")
return



ButtonCerrar:
    Gui, Destroy
return

elegirimagenes(path)
{
	Loop, %path%, d
	{
		Gui, +AlwaysOnTop +ToolWindow
		Gui, Add, Picture, w100 h-1, d:\logo.png
		Gui,Font, s14 Bold
		Gui, Add, Text,xp+120 ys-0, Registro de Procedimientos de Endoscopia
		Gui, Add, Text,xp+0 ys+25, Aplicaciones Neuquinas de Salud
		Gui,Font, s12 Normal

		Gui, Add, Picture,xp-120 ys+70 , %A_LoopFileFullPath%
		Gui +OwnDialogs
		Gui, Show,, Endoscopia - Seleccionar imagenes
		SetTimer, WinMoveMsgBox, 50
		;MsgBox, 4096, , Text
		MsgBox , 4131 ,Title , Desea Enviar a PACS? Cancelar para finalizar el proceso general
		WinMove, img_select.ahk ,,0, 0
		Gui, Destroy
		IfMsgBox, Cancel
			break
		IfMsgBox, Yes
			{
			;MsgBox, 4096 ,,  % A_LoopFileShortName
			imagenes .= A_LoopFileName " "
			;imagenes:= %A_LoopFileShortName%
		}
	}
	;Run "D:\dicomlib.exe" "stow" %imagenes%
}
WinMoveMsgBox:
  SetTimer, WinMoveMsgBox, OFF
  WinMove, Title, , 50, 450

ButtonIniciar:
	FileDelete, sps.json
	FileAppend , % "[" JSON.Dump(Mwl[PacienteSeleccionado])  . "]" , d:\sps.json
	if (PacienteSeleccionado > 0)
	{
		;Run "D:\dicomlib.exe" "sps"
		Gui, Destroy
		WinClose, ahk_exe MediaExpress.exe
		WinWaitClose, ahk_exe MediaExpress.exe
		paciente:=Mwl[PacienteSeleccionado].100010.Value[1].Alphabetic
		StringReplace , paciente , paciente , ^ , _ , All
		StringReplace , paciente , paciente , %A_Space% , _ , All
		drive:= "D:"
		sep:="\"
		estudio:= A_Now
		path= %drive%%sep%%paciente%%sep%%estudio%
		Run "D:\mkdir.bat" %path%
		Run MediaExpress.exe
		Sleep 2000
		WinActivate, ahk_exe MediaExpress.exe
		WinWaitActive, ahk_exe MediaExpress.exe
		send, ^s
		Sleep 1000
		send, %path%%sep%%estudio%.xml
		send, {Enter}
		Sleep 1000
		send, ^,
		Sleep 1000
		send, `t`t
		send, %path%%sep%video
		send, `t`t
		send, %path%%sep%img
		send, `t`t`t`t`t`t{Enter}
		PacienteSeleccionado := 0
		WinWaitClose, ahk_exe MediaExpress.exe
		path = %drive%%sep%%paciente%%sep%%estudio%%sep%img
		;Run "D:\imgconv.exe" %path%
		path = %drive%%sep%%paciente%%sep%%estudio%%sep%img%sep%*.jpeg
		elegirimagenes(path)
		return
	}
return
