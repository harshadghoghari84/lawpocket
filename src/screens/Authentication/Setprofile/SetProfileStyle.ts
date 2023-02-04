import { makeStyles } from 'react-native-elements';

export const commonStyles = makeStyles(theme => ({
  progressBarCont: {
    marginVertical: theme.spacing.l - 4,
    marginHorizontal: theme.spacing.l - 4,
  },
  txtTitle: {
    fontSize: theme.fontSize.m,
    marginHorizontal: theme.spacing.l - 4,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  modalizeCont: {
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.l - 4,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtModalText: {
    fontSize: theme.fontSize.m,
    color: theme.colors.blueText,
    fontWeight: '500',
  },
  modalDividerCont: {
    width: '85%',
    height: 0.5,
    backgroundColor: theme.colors.grey,
  },
  openPickerCont: {
    height: 50,

    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalizeCancelBtn: {
    height: 50,
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.l - 4,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.m - 6,
    marginBottom: theme.spacing.m - 6,
  },
  backCont: {
    height: 45,
    width: 45,
    borderRadius: theme.borderRadii.m + 2,
    borderColor: theme.colors.grey,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.m + 4,
    paddingVertical: theme.spacing.m - 6,
  },
  modalHandleStyle: { backgroundColor: theme.colors.modalHandleColor },
  modalStyle: {
    backgroundColor: theme.colors.transparent,
  },
  fontBold: {
    fontWeight: '700',
  },
}));
