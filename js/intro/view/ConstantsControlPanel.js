// Copyright 2016, University of Colorado Boulder

/**
 * Panel responsible for keeping the spring constant and spring thickness constant.
 * This panel should only be visible when in scene with adjustable spring length.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var thicknessString = require( 'string!MASSES_AND_SPRINGS/thickness' );

  // constants
  var TITLE_FONT = MassesAndSpringsConstants.TITLE_FONT;
  var MAX_TEXT_WIDTH = MassesAndSpringsConstants.MAX_TEXT_WIDTH;
  var FONT = MassesAndSpringsConstants.FONT;

  /**
   *
   * @param {Property.<string>} selectedConstantProperty determines which value to hold constant, values are 'spring-constant' and 'spring-thickness'
   * @param {string} title: string used to title the panel
   * @param {tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function ConstantsControlPanel( selectedConstantProperty, title, tandem, options ) {
    options = _.extend( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      xMargin: 5,
      yMargin: 5,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      visible: false,
      tandem: tandem
    }, options );

    var constantsSelectionButtonOptions = {
      font: FONT,
      maxWidth: MAX_TEXT_WIDTH
    };

    // @private {read-only} radius of button
    var constantsSelectionButtonRadius = 6;
    var thicknessText = new Text(
      thicknessString,
      _.extend( { tandem: tandem.createTandem( 'thicknessText' ) },
        _.extend( { tandem: tandem.createTandem( 'thicknessString' ) },
          constantsSelectionButtonOptions
        ) ) );
    var thicknessRadioButton = new AquaRadioButton( selectedConstantProperty, 'spring-thickness', thicknessText, {
      radius: constantsSelectionButtonRadius,
      tandem: tandem.createTandem( 'thicknessRadioButton' )
    } );

    var constantText = new Text(
      StringUtils.fillIn( springConstantString, { spring: '' } ),
      _.extend( { tandem: tandem.createTandem( 'constantText' ) },
        constantsSelectionButtonOptions ) );
    var springConstantRadioButton = new AquaRadioButton( selectedConstantProperty, 'spring-constant', constantText, {
      radius: constantsSelectionButtonRadius,
      tandem: tandem.createTandem( 'springConstantRadioButton' )
    } );

    // @private {read-only} spacing used for radio buttons
    var radioButtonSpacing = 4;
    Panel.call( this, new VBox( {
      align: 'left',
      spacing: radioButtonSpacing,
      children: [
        new Text( title, { font: TITLE_FONT, tandem: tandem } ),
        springConstantRadioButton,
        thicknessRadioButton
      ],
      tandem: tandem.createTandem( 'vBox' )
    } ), options );
  }

  massesAndSprings.register( 'ConstantsControlPanel', ConstantsControlPanel );

  return inherit( Panel, ConstantsControlPanel );

} );
