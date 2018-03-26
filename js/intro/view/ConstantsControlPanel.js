// Copyright 2017-2018, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var thicknessString = require( 'string!MASSES_AND_SPRINGS/thickness' );

  // constants
  var TITLE_FONT = MassesAndSpringsConstants.LABEL_FONT;
  var RADIO_BUTTON_SPACING = 4;

  /**
   * @param {Property.<string>} selectedConstantProperty determines which value to hold constant, values are 'spring-constant' and 'spring-thickness'
   * @param {string} title: string used to title the panel
   * @param {tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function ConstantsControlPanel( selectedConstantProperty, title, tandem, options ) {
    options = _.extend( {
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      visible: false,
      fill: 'white',
      stroke: 'gray',
      tandem: tandem
    }, options );

    Node.call( this, options );

    var constantsSelectionButtonOptions = {
      font: TITLE_FONT,
      maxWidth: 100
    };

    var thicknessText = new Text(
      thicknessString,
      //REVIEW: I'd review exactly how _.extend works (or at least its documentation). This looks like thicknessText
      //REVIEW: gets overwritten by thicknessString, which probably isn't intended? There should also never be a need
      //REVIEW: to next _.extend (or prove me wrong?)
      _.extend( { tandem: tandem.createTandem( 'thicknessText' ) },
        _.extend( { tandem: tandem.createTandem( 'thicknessString' ) },
          constantsSelectionButtonOptions
        ) ) );
    var thicknessRadioButton = new AquaRadioButton( selectedConstantProperty, 'spring-thickness', thicknessText, {
      radius: MassesAndSpringsConstants.RADIO_BUTTON_RADIUS,
      tandem: tandem.createTandem( 'thicknessRadioButton' )
    } );

    var constantText = new Text(
      StringUtils.fillIn( springConstantString, { spring: '' } ),
      _.extend( { font: TITLE_FONT, tandem: tandem.createTandem( 'constantText' ) },
        constantsSelectionButtonOptions ) );
    var springConstantRadioButton = new AquaRadioButton( selectedConstantProperty, 'spring-constant', constantText, {
      radius: MassesAndSpringsConstants.RADIO_BUTTON_RADIUS,
      tandem: tandem.createTandem( 'springConstantRadioButton' )
    } );

    var nodeContent = new VBox( {
      align: 'left',
      spacing: RADIO_BUTTON_SPACING,
      children: [
        new Text( title, { font: TITLE_FONT, tandem: tandem } ), springConstantRadioButton, thicknessRadioButton
      ],
      tandem: tandem.createTandem( 'vBox' )
    } );
    this.addChild( nodeContent );
  }

  massesAndSprings.register( 'ConstantsControlPanel', ConstantsControlPanel );
  return inherit( Node, ConstantsControlPanel );

} );
