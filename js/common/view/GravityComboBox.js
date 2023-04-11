// Copyright 2019-2023, University of Colorado Boulder

/**
 * ComboBox used for selecting planets.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';
import Body from '../model/Body.js';

class GravityComboBox extends ComboBox {

  /**
   * @param {Property.<string>} bodyProperty
   * @param {Node} listNodeParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  constructor( bodyProperty, listNodeParent, tandem, options ) {
    options = merge( {
      cornerRadius: 3,
      xMargin: 10,
      yMargin: 6,
      tandem: tandem.createTandem( 'gravityComboBox' ),

      // options for body text
      bodyFont: MassesAndSpringsConstants.LABEL_FONT,
      bodyMaxWidth: 140,
      xOffset: 107
    }, options );

    // {ComboBoxItem[]}
    const items = Body.BODIES.map( body => {
      return {
        value: body,
        createNode: () => {
          const bodyLabelText = new Text( body.title, {
            font: options.bodyFont,
            maxWidth: options.bodyMaxWidth,
            tandem: tandem.createTandem( 'bodyLabelText' )
          } );
          bodyLabelText.localBounds = bodyLabelText.localBounds.withX( options.xOffset );
          return bodyLabelText;
        }
      };
    } );

    super( bodyProperty, items, listNodeParent, options );
  }
}

massesAndSprings.register( 'GravityComboBox', GravityComboBox );
export default GravityComboBox;