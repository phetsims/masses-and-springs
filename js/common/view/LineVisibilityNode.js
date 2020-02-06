// Copyright 2017-2020, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  const equilibriumPositionString = require( 'string!MASSES_AND_SPRINGS/equilibriumPosition' );
  const massEquilibriumString = require( 'string!MASSES_AND_SPRINGS/massEquilibrium' );
  const movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  const naturalLengthString = require( 'string!MASSES_AND_SPRINGS/naturalLength' );

  // constants
  const DEFAULT_CONTENT_SPACING = 155;
  const TEXT_MAX_WIDTH = 130;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function LineVisibilityNode( model, tandem, options ) {
    options = merge( {
      massEquilibrium: false,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'LineVisibilityNode' )
    }, options );

    Node.call( this, options );

    // Lines added for reference in panel
    const greenLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb(0, 180, 0)', tandem.createTandem( 'greenLine' ) );
    const blueLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb( 65, 66, 232 )', tandem.createTandem( 'blueLine' ) );
    const redLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'red', tandem.createTandem( 'redLine' ) );

    let equilibriumText = new Text( equilibriumPositionString, {
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
    const alignGroup = new AlignGroup( { matchVertical: false } );

    // Align boxes used for labels
    const naturalLengthVisibleAlignBox = new AlignBox( new Text( naturalLengthString, {
      font: MassesAndSpringsConstants.TITLE_FONT, maxWidth: TEXT_MAX_WIDTH
    } ), { group: alignGroup, xAlign: 'left' } );
    const equilibriumAlignBox = new AlignBox( equilibriumText, { group: alignGroup, xAlign: 'left' } );
    const movableAlignBox = new AlignBox( new Text( movableLineString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      tandem: tandem.createTandem( 'movableLineString' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // Max width must be set to the maxWidth of the alignGroup based on its content.
    const contentSpacing = DEFAULT_CONTENT_SPACING - alignGroup.getMaxWidth();

    // Create checkboxes using align boxes above
    const indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
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
    const titleToControlsVerticalSpace = 2;
    const indicatorVisibilityControlsVBox = new VBox( {
        children: [
          new VStrut( titleToControlsVerticalSpace ),
          indicatorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    const controlBox = new HBox( {
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