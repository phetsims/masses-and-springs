// Copyright 2017-2019, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  var equilibriumPositionString = require( 'string!MASSES_AND_SPRINGS/equilibriumPosition' );
  var massEquilibriumString = require( 'string!MASSES_AND_SPRINGS/massEquilibrium' );
  var movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  var naturalLengthString = require( 'string!MASSES_AND_SPRINGS/naturalLength' );

  // constants
  var DEFAULT_CONTENT_SPACING = 155;
  var TEXT_MAX_WIDTH = 130;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function LineVisibilityNode( model, tandem, options ) {
    options = _.extend( {
      massEquilibrium: false,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'LineVisibilityNode' )
    }, options );

    Node.call( this, options );

    // Lines added for reference in panel
    var greenLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb(0, 180, 0)', tandem.createTandem( 'greenLine' ) );
    var blueLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb( 65, 66, 232 )', tandem.createTandem( 'blueLine' ) );
    var redLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'red', tandem.createTandem( 'redLine' ) );

    var equilibriumText = new Text( equilibriumPositionString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      tandem: tandem.createTandem( 'equilibriumPositionString' )
    } );

    if ( options.massEquilibrium ) {
      equilibriumText = new Text( massEquilibriumString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: TEXT_MAX_WIDTH,
        tandem: tandem.createTandem( 'equilibriumPositionString' )
      } );
    }

    // Align group used for label align boxes
    var alignGroup = new AlignGroup( { matchVertical: false } );

    // Align boxes used for labels
    var naturalLengthVisibleAlignBox = new AlignBox( new Text( naturalLengthString, {
      font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: TEXT_MAX_WIDTH
    } ), { group: alignGroup, xAlign: 'left' } );
    var equilibriumAlignBox = new AlignBox( equilibriumText, { group: alignGroup, xAlign: 'left' } );
    var movableAlignBox = new AlignBox( new Text( movableLineString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      tandem: tandem.createTandem( 'movableLineString' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // Max width must be set to the maxWidth of the alignGroup based on its content.
    var contentSpacing = DEFAULT_CONTENT_SPACING - alignGroup.getMaxWidth();

    // Create checkboxes using align boxes above
    var indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      node: new HBox( { children: [ naturalLengthVisibleAlignBox, blueLine ], spacing: contentSpacing } ),
      property: model.naturalLengthVisibleProperty,
      label: naturalLengthString
    }, {
      node: new HBox( { children: [ equilibriumAlignBox, greenLine ], spacing: contentSpacing } ),
      property: model.equilibriumPositionVisibleProperty,
      label: equilibriumPositionString
    }, {
      node: new HBox( { children: [ movableAlignBox, redLine ], spacing: contentSpacing } ),
      property: model.movableLineVisibleProperty,
      label: movableLineString
    } ], {
      checkboxOptions: { spacing: 8, boxWidth: 16 },
      tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
    } );
    var titleToControlsVerticalSpace = 2;
    var indicatorVisibilityControlsVBox = new VBox( {
        children: [
          new VStrut( titleToControlsVerticalSpace ),
          indicatorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    var controlBox = new HBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlsVBox
      ]
    } );
    this.addChild( controlBox );
  }

  massesAndSprings.register( 'LineVisibilityNode', LineVisibilityNode );

  return inherit( Node, LineVisibilityNode );
} );